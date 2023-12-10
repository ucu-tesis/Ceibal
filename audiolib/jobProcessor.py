import psycopg2
import requests
import os
import boto3
import time
from analizar_audio import analisis_audio
from helpers import save_data, getImageAndJson
from dotenv import load_dotenv

load_dotenv()

s3_client = boto3.client('s3')

def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

# TODO add WORKING + stale
# TODO add retrying failed jobs
def grab_pending_row():    
    # source for query: https://dba.stackexchange.com/questions/69471/postgres-update-limit-1
    # this is for supporting concurrency between different processors
    sql = """
        UPDATE "Analysis"
        SET status = 'WORKING'
        WHERE id = (
            SELECT id
            FROM   "Analysis"
            WHERE  status = 'PENDING'
            LIMIT  1
            FOR    UPDATE SKIP LOCKED
        )
        RETURNING id
    """
    updated_row_id = None
    try:
        with get_db_connection() as conn, conn.cursor() as cur:
            cur.execute(sql)
            
            updated_rows = cur.rowcount
            if updated_rows > 0:
                updated_row_id = cur.fetchone()[0]
            
            conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print("query error:")
        print(error)

    return updated_row_id

def get_recording_data(analysis_id):
    sql = """
        SELECT "Reading".content as text, recording_url, recording_id
        FROM "Analysis"
        JOIN "Recording" on "Recording".id = "Analysis".recording_id
        JOIN "EvaluationGroupReading" on "EvaluationGroupReading".id = "Recording".evaluation_group_reading_id
        JOIN "Reading" on "Reading".id = "EvaluationGroupReading".reading_id
        WHERE "Analysis".id = %s
    """
    recording_data = None
    try:
        with get_db_connection() as conn, conn.cursor() as cur:
            cur.execute(sql, (analysis_id,))
            
            recording_data = cur.fetchone()        
    except (Exception, psycopg2.DatabaseError) as error:
        print("query error:")
        print(error)

    return recording_data

def store_result(analysis_id, recording_id, resJson):    
    # source for query: https://dba.stackexchange.com/questions/69471/postgres-update-limit-1
    # this is for supporting concurrency between different processors
    sql = """
        UPDATE "Analysis"
        SET
            status = 'COMPLETED',
            repetitions_count = %s
            silences_count = %s
            allosaurus_general_error = %s
            similarity_error = %s
            repeated_phonemes = %s
            words_with_errors = %s
            words_with_repetitions = %s
            score = %s
            error_timestamps = %s
            repetition_timestamps = %s
            phoneme_velocity = %s
            words_velocity = %s
            raw_analysis = %s
            recording_id = %s
        WHERE id = %s
    """

    success = False
    try:
        with get_db_connection() as conn, conn.cursor() as cur:
            cur.execute(
                sql,
                (
                    resJson.cantidad_de_repeticiones,
                    resJson.cantidad_de_silencios,
                    resJson.error_general_allosaurus,
                    resJson.error_similitud,
                    resJson.fonemas_repetidos,
                    resJson.palabras_con_errores,
                    resJson.palabras_con_repeticiones,
                    resJson.puntaje,
                    resJson.tiempo_errores,
                    resJson.tiempo_repeticiones,
                    int(resJson.velocidad_fonemas) if resJson.velocidad_fonemas else 0,
                    int(resJson.velocidad_palabras) if resJson.velocidad_palabras else 0,
                    resJson,
                    recording_id,
                    analysis_id
                )
            )
            
            updated_rows = cur.rowcount
            
            conn.commit()

            if updated_rows > 0:
                success = True
    except (Exception, psycopg2.DatabaseError) as error:
        print("query error:")
        print(error)
    
    return success

def process_row(analysis_id):
    recording_data = get_recording_data(analysis_id)
    if not recording_data:
        print("DB query failed fetching data for analysis id " + analysis_id)
        return
    (text, s3_object_key, recording_id) = recording_data

    print("Generating presigned url from s3")
    presigned_recording_url = s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': os.getenv('AWS_BUCKET'),
            'Key': s3_object_key
        },
        ExpiresIn=3*60 # 3 minutes
    )
    print("Requesting file from S3")
    with requests.get(presigned_recording_url, stream=True) as r:
        if r.ok:
            print("Copying recording to file system")
            newDir, dirName = save_data(r.raw, text)
        else: # HTTP status code 4XX/5XX
            print("Download failed: status code {}\n{}".format(r.status_code, r.text))
            return
    
    print("File successfully fetched and stored at " + newDir)
    
    analisis_audio(newDir, dirName, '.webm', text, True)
    resJson, img1, img2, img3, img4 = getImageAndJson(newDir)

    did_store_result = store_result(analysis_id, recording_id, resJson)

    print("Result: " + did_store_result)

while True:
    updated_row_id = grab_pending_row()
    if updated_row_id:
        print("found and locked analysis for processing. id: " + str(updated_row_id))
        process_row(updated_row_id)
        time.sleep(1)
    else:
        print("no analysis pending to process")
        time.sleep(30)
