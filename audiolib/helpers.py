import os
import sys

init_dir = os.path.dirname(__file__)
sys.path.append(os.path.join(init_dir, 'Procesamiento'))

import errno
import shutil
from datetime import datetime

import base64
import json


def create_new_directory(dirName):
        newDir = os.path.join(
            os.path.dirname(__file__), 
            "data",
            dirName)

        try:
            if not os.path.exists(newDir):
                os.makedirs(newDir)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise  # This was not a "directory exist" error..
            return False
        except:
            raise "Aglo salio raro"
        
        return newDir


def save_data(file, text):
    dateString = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    # Create directory
    newDir = create_new_directory(dateString)

    if newDir:
        # Save file to directory
        with open(os.path.join(newDir, f'{dateString}.webm'), 'wb') as audioFile:
            shutil.copyfileobj(file.file, audioFile)

        # Save text to directory.
        with open(os.path.join(newDir, f'{dateString}.txt'), 'w') as textFile:
            textFile.write(text)

    else:
        print("Error. Can't create the folder.")    

    return newDir, dateString
    
# importing
from analizar_audio import analisis_audio

def prueba(fecha):
    INPUT_DIR = os.path.join('data', fecha)
    FILENAME = fecha
    AUDIO_EXT = '.mp3'

    TEXT = "¡Pobre Diógenes! Fue un error mirarse en el espejo luego de haber comido cinco páginas \
        de un antiguo libro de animales... Cuando vio su imagen reflejada, descubrió que ya no quería \
        ser ratón. No me gusta ser como soy, quiero ser otro. ¡Es tan difícil ser uno mismo!, \
        pensó mientras desaprobaba sus orejas gigantescas, sus ojos saltones y sus dientes desparejos. \
        ¡Seré un jabalí!, exclamó de pronto Diógenes. Y al instante, como por milagro, se transformó \
        en un extraño jabalí."

    analisis_audio(INPUT_DIR, FILENAME, AUDIO_EXT, TEXT, False)
    

    return "json", "imagen"

def getImageAndJson_1image(dir):
    resultDir = os.path.join(dir, 'resultado')

    img_dir = os.path.join(resultDir, 'graficos.jpg')
    json_dir = os.path.join(resultDir, 'indicadores.json')

    with open(img_dir, "rb") as image_file:
        encoded_image_string = base64.b64encode(image_file.read())

    print(json_dir)
    jsonFile = open(json_dir)
    resJson = json.load(jsonFile)

    return resJson, encoded_image_string

def getImageAndJson(dir):
    resultDir = os.path.join(dir, 'resultado')

    img1 = os.path.join(resultDir, 'graficos_1.jpg')
    img2 = os.path.join(resultDir, 'graficos_2.jpg')
    img3 = os.path.join(resultDir, 'graficos_3.jpg')
    img4 = os.path.join(resultDir, 'graficos_4.jpg')
    json_dir = os.path.join(resultDir, 'indicadores.json')



    with open(img1, "rb") as image_file:
        img1_encoded = base64.b64encode(image_file.read())
    with open(img2, "rb") as image_file:
        img2_encoded = base64.b64encode(image_file.read())
    with open(img3, "rb") as image_file:
        img3_encoded = base64.b64encode(image_file.read())
    with open(img4, "rb") as image_file:
        img4_encoded = base64.b64encode(image_file.read())

    print(json_dir)
    jsonFile = open(json_dir)
    resJson = json.load(jsonFile)

    return resJson, img1_encoded, img2_encoded, img3_encoded, img4_encoded


if __name__ == "__main__":
    print("This is a helper file...")

    # resJson, img = prueba("2022-12-08_16-33-26")
    # print(resJson)