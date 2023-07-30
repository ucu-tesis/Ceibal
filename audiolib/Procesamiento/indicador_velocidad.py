import time
import os
import soundfile as sf
from scipy import io, signal
from scipy.io.wavfile import read
# from IPython.display import Audio

# Vosk
from vosk import Model, KaldiRecognizer, SetLogLevel
import wave
import json

import allosaurus
from allosaurus.app import read_recognizer

import numpy as np

from indicador_force_aligner import add_silence_to_audio

INPUT_DIR = './input/outloud/'
OUTPUT_DIR = './output/'
TEMP_DIR = './tmp/'

def generate_vosk_recognizer(preTrainedModel, sr):
    model = Model(preTrainedModel)
    rec = KaldiRecognizer(model, sr)
    
    return rec

def vosk_transcriber(wavFile, sr, recognizer):
    # First read the wav file
    wf = wave.open(wavFile, "rb")
    # Transcription will be stored here
    transcription = []

    while True:
        data = wf.readframes(16000)
        #print(data)
        if len(data) == 0:
            break
        if recognizer.AcceptWaveform(data):
            # Convert json output to dict
            result_dict = json.loads(recognizer.Result())
            # Extract text values and append them to transcription list
            transcription.append(result_dict.get("text", ""))

    #print(transcription)
    # Get final bits of audio and flush the pipeline
    final_result = json.loads(recognizer.FinalResult())
    transcription.append(final_result.get("text", ""))

    # merge or join all list elements to one big string
    transcription_text = ' '.join(transcription)
    #print(transcription_text)
    return transcription
    

def speed_indicator(folder, audio_samples, sr, wSize, offset):
    """Retorna cantidad de fonemas y palabras por segundo del audio contenido en audio_samples (mono),
    muestreado a sr (debe ser 16kHz para Vosk)

    Args:
        folder (string): carpeta para almacenar archivo auxiliar
        audio_samples (numpy array): muestras de señal de audio
        sr (int): frecuencia de muestreo de señal de audio
        wSize (int): tamaño de ventana de análisis en segundos
        offset (int): salto entre ventanas para análisis

    Returns:
        wSpeeds (numpy Array): vector con velocidad de palabras
        pSpeeds (numpy Array): vector con velocidad de fonemas
        timeSpeeds (numpy Array): vector con eje de tiempos para velocidades
    """
    
    SetLogLevel(-1)
    absolute_path = os.path.dirname(__file__)
    relative_model_path = '../models/vosk-model-small-es-0.22'
    model_path = os.path.join(absolute_path, relative_model_path)
    print(model_path)
    rec = generate_vosk_recognizer(model_path, sr)
    allosaurus_model = read_recognizer()
    
    # all_transcriptions = []
    wSpeeds = []
    pSpeeds = []
    
    # largo de la señal
    L = audio_samples.shape[0]
    # ventana de análisis
    win_samp = int(sr*wSize)
    # salto entre ventanas
    hop_samp = int(sr*offset)
    
    # frames a procesar
    num_frames = int((L-win_samp)/hop_samp)

    # TODO si num_frames <= 0 tirar error distinto (esperado) en el backend
    
    #frecuencia de muestreo de señal de salida
    sr_y = sr/hop_samp
    timeSpeeds = np.linspace(wSize/2, num_frames/sr_y, num_frames)
    
    # Proceso cada señal del frame
    for i in range(num_frames):
        ind_ini = i*hop_samp
        ind_end = ind_ini + win_samp
        
        frame = audio_samples[ind_ini:ind_end]

        #Converts to PCM16 for Vosk
        audio_ints = (frame * 32767).astype(np.int16)
        audio_ints_le = audio_ints.astype('<u2')
        audio_pcm16 = audio_ints_le.tobytes()

        rec.AcceptWaveform(audio_pcm16)
        text = json.loads(rec.Result())["text"]
        wordsCount = len(text.split())
        wSpeeds.append(wordsCount * 60 / wSize)

        #Phonemes count
        audio_silence = add_silence_to_audio(frame, sr)

        sf.write(folder + 'test.wav', audio_silence, sr)
        phonemes = allosaurus_model.recognize(folder + 'test.wav','spa')

        phonesCount = len(phonemes.replace(' ',''))
        pSpeeds.append(phonesCount * 60 / wSize)

    return wSpeeds, pSpeeds, timeSpeeds

if __name__ == '__main__':

    fileDir = (os.path.join(INPUT_DIR, 'outloud_001.wav'))

    sr = 16000
    wSize = 30
    offset = 10

    wSpeeds, pSpeeds = speed_indicator(fileDir, sr, wSize, offset)

    print(wSpeeds)
    print(pSpeeds)