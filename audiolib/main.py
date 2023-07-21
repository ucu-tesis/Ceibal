import uvicorn

from helpers import save_data, getImageAndJson
from fastapi import FastAPI, UploadFile, File, Form, Body

# TODO comparar analizar_audio con Procesamiento/analizar_audio
from analizar_audio import analisis_audio

# NOTE: if print doesnt work, use the following pattern:
# import logging
# logging.getLogger("uvicorn").info("test-log")

app = FastAPI()

# async def process_audio(path: str = Body(..., embed=True)):

@app.post("/process_audio")
async def process_audio(
    text: str = Form(...),
    file: UploadFile = File(...)
):
    newDir, dirName = save_data(file, text)
    # TODO revisar el ultimo arg, si es False los siguientes parametros son mockeados en la respuesta:
    # puntaje, palabras_con_errores, tiempo_errores, error_general_allosaurus,
    # palabras_con_repeticiones, tiempo_repeticiones.
    # Tambien puede ser que se esten mockeando algunas cosas en las graficas
    # TODO revisar formato webm vs mp3
    analisis_audio(newDir, dirName, '.webm', text, True)
    resJson, img1, img2, img3, img4 = getImageAndJson(newDir)

    payload = {
        "indicadores": resJson,
        # "images": [img1, img2, img3, img4],
    }

    return payload

@app.get("/")
async def root():
    return {"Message": "Hello there."}


# import os 
# import time

# @app.post("/debug")
# async def image():

#     dirName = '2022-12-13_15-30-07'
#     newDir = os.path.join(
#             os.path.dirname(__file__), 
#             "data",
#             dirName)


#     # newDir, dirName = save_data(file, text)
#     # analisis_audio(newDir, dirName, '.mp3', text, False)
#     time.sleep(3)
#     resJson, img1, img2, img3, img4 = getImageAndJson(newDir)

#     payload = {
#         "json": resJson,
#         "images": [img1, img2, img3, img4],
#        }

#     return payload


# @app.post("/")
# async def image(
#     text: str = Form(...),
#     file: UploadFile = File(...)
# ):
#     newDir, dirName = save_data(file, text)
#     analisis_audio(newDir, dirName, '.mp3', text, False)
#     resJson, img1, img2, img3, img4 = getImageAndJson(newDir)

#     payload = {
#         "json": resJson,
#         "images": [img1, img2, img3, img4],
#     }

#     return payload

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)