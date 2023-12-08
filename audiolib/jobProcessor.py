import psycopg2
import requests
from helpers import save_data, getImageAndJson
# from analizar_audio import analisis_audio

# TODO get this from env
def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="ceibal_development",
        user="postgres",
        password="password",
        port="5433"
    )

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
        SELECT "Reading".content as text, recording_url
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

def process_row(analysis_id):
    recording_data = get_recording_data(analysis_id)
    if not recording_data:
        print("DB query failed fetching data for analysis id " + analysis_id)
        return
    (text, recording_url) = recording_data

    print("Requesting file from S3")
    with requests.get(recording_url, stream=True) as r:
        if r.ok:
            print("Copying recording to file system")
            newDir, dirName = save_data(r.raw, text)
        else: # HTTP status code 4XX/5XX
            print("Download failed: status code {}\n{}".format(r.status_code, r.text))
            return
    
    print(newDir)
    print(dirName)
    
    # analisis_audio(newDir, dirName, '.webm', text, True)
    # resJson, img1, img2, img3, img4 = getImageAndJson(newDir)

    # update analysis row using data from resJson

    # if (data) {
    #   const stats = data.indicadores;
    #   await this.prismaService.analysis.create({
    #     data: {
    #       status: AnalysisStatus.COMPLETED,
    #       repetitions_count: stats.cantidad_de_repeticiones,
    #       silences_count: stats.cantidad_de_silencios,
    #       allosaurus_general_error: stats.error_general_allosaurus,
    #       similarity_error: stats.error_similitud,
    #       repeated_phonemes: stats.fonemas_repetidos,
    #       words_with_errors: stats.palabras_con_errores,
    #       words_with_repetitions: stats.palabras_con_repeticiones,
    #       score: stats.puntaje,
    #       error_timestamps: stats.tiempo_errores,
    #       repetition_timestamps: stats.tiempo_repeticiones,
    #       phoneme_velocity: Number(stats.velocidad_fonemas) || 0,
    #       words_velocity: Number(stats.velocidad_palabras) || 0,
    #       raw_analysis: data,
    #       recording_id: recording.id,
    #     },
    #   });
    # }

# TODO make this into a loop
updated_row_id = grab_pending_row()
if updated_row_id:
    print("found and locked analysis for processing. id: " + str(updated_row_id))
    process_row(updated_row_id)
else:
    print("no analysis pending to process")