'''
Created on Fri Nov 18 2022 09:47:03

analizar_audio.py: Calcula indicador a partir de audio y texto de lectura realizada.
Asume que el audio corresponde a la lectura del texto ingresado.

Long description


project: Procesamiento de audio para evaluación de lectura
@author: Leonardo Martinez Hornak
email: lmartinez@ceibal.edu.uy
Copyright (c) 2022 Ceibal
'''
import os
import shutil
import numpy as np
import matplotlib.pyplot as plt

import json
from datetime import datetime

from scipy import io, signal
from scipy.io.wavfile import read

from time import perf_counter

import librosa
import soundfile as sf

from Procesamiento.indicador_force_aligner import get_similarity_aligned
from Procesamiento.indicador_pausas import get_rep_sim_pauses_indicator
from Procesamiento.indicador_velocidad import speed_indicator

init_dir = os.path.dirname(__file__)
#INPUT_DIR = os.path.join(init_dir, 'input', 'audio_corto')
#FILENAME = 'audio_corto'
AUDIO_EXT = '.wav'

#TEXT = "¡Pobre Diógenes! Fue un error mirarse en el espejo luego de haber comido cinco páginas \
#    de un antiguo libro de animales... Cuando vio su imagen reflejada, descubrió que ya no quería \
#    ser ratón. No me gusta ser como soy, quiero ser otro. ¡Es tan difícil ser uno mismo!, \
#    pensó mientras desaprobaba sus orejas gigantescas, sus ojos saltones y sus dientes desparejos. \
#    ¡Seré un jabalí!, exclamó de pronto Diógenes. Y al instante, como por milagro, se transformó \
#    en un extraño jabalí."

INPUT_DIR = os.path.join(init_dir, 'input','outloud', 'outloud_009')
FILENAME = 'outloud_009'
TEXT = "En el bosque había de todo: zorros, mulitas, abejas y ardillas, caracoles y cotorras, y entre todo ese entrevero de bichos había un pájaro chiquito y simpático que estaba por hacer un viaje muy especial. Pipo, ese era su nombre, volaba bajito entre los helechos saludando a todos."
#Para usar MFA, se necesita archivo con transcripción con mismo nombre en extensión .lab
PHON_ERROR_TH = 0.5
MIN_PAUSES = 0.4

def generate_lab_file(folder, filename, text):
    """Genera archivo lab necesario para MFA

    Args:
        folder (string): Indica carpeta a almacenar archivo
        filename (string): Indica nombre de archivo
        text (string): Indica texto a almacenar
    """
    with open(os.path.join(folder, filename + '.lab'), 'w') as f:
        f.write(text)

def set_up_mfa_folder(input_dir, mfa_folder, filename, audio_ext):
    """Configura carpeta con archivo de sujeto de prueba. MFA espera en esa carpeta archivo .wav y lab con
    transcripción. De haber más archivos, asume que son del mismo sujeto y utiliza esto como información.

    Args:
        input_dir (string): Carpeta donde se encuentra el archivo deseado
        mfa_folder (string): Carpeta donde se encuentra el archivo de análisis para MFA
        filename (string): nombre del archivo sin extensión
        audio_ext(string): formato de audio (.mp3)

    Returns:
        None
    """
    #Borro archivos de carpeta temporal
    files = os.listdir(mfa_folder)
    for f in files:
        os.remove(os.path.join(mfa_folder, f))
    
    #Muevo archivos deseados
    shutil.copyfile(os.path.join(input_dir, filename + '.lab'), os.path.join(mfa_folder, filename + '.lab'))

    #Archivo debe tener extensión wav
    import logging
    logging.getLogger("uvicorn").info(audio_ext)
    if audio_ext != '.wav':
        audio_aux, sr = librosa.load(os.path.join(input_dir, filename+audio_ext), dtype=np.float32)
        sf.write(os.path.join(mfa_folder, filename + '.wav'), audio_aux, sr, 'PCM_24')
    else:
        shutil.copyfile(os.path.join(input_dir, filename + audio_ext), os.path.join(mfa_folder, filename + audio_ext))
    
def generar_graficos_individuales(name, output_dir, t_audio, audio, pause_array, allo_aligned_dst, time, t_speed, word_speed, phoneme_speed, pause_segments):
    """Genera gráficos a partir de resultados del análisis. De forma individual
    
    Args:
        name (string): nombre de archivo a guardar
        output_dir (string): Carpeta donde se almacenan los gráficos
        t_audio (np array): instantes de tiempo de audio según frecuencia de muestreo
        audio (np array): vector de muestras de audio
        pause_array (np array): indica con 1 pausa detectada
        allo_aligned_dst (np array): Distancia de edición calculada por Allosarus luego de MFA
        time (np array): Vector temporal de análisis de similitud
        t_speed (np array): vector de tiempos para velocidad
        word_speed (np array): velocidad en palabras por segundos según t_speed
        phoneme_speed (np array): velocidad en fonemas por segundos según t_speed
        pause_segments (np array):Vector con duración de pausas

    Returns:
        None
    """
    fig, ax = plt.subplots(1,1, figsize=(12,4))
    plt.rcParams.update({'font.size': 15})

    ax.plot(t_audio, audio, 'b', label="Forma de Onda")
    ax.set_xlabel('Tiempo (s)')
    ax.set_ylabel('Amplitud')
    ax.plot(t_audio, pause_array, color='gray', label="Pausas")
    ax.axes.get_yaxis().set_ticks([-1, -0.5, 0, 0.5, 1])
    
    ax.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, name+'_1.jpg'), dpi=100) 
    
    #Suaviza vector de distancia de edición
    kernel_len = 3
    kernel_half = int(kernel_len/2)
    aux_dst = np.zeros(len(allo_aligned_dst)+kernel_len)
    aux_dst[kernel_half:-kernel_half-1] = allo_aligned_dst
    dst_mean = np.zeros(len(allo_aligned_dst))
    for i in range(len(allo_aligned_dst)):
        dst_mean[i] = np.mean(aux_dst[i:i+kernel_len])
    
    fig, ax = plt.subplots(1,1, figsize=(12,4))
    
    ax.plot(time, dst_mean, color='orange', label="Error")
    aux_ax = ax.twinx()
    ax.set_xlabel('Tiempo (s)')
    ax.set_ylabel('Distancia de edición')
    
    ax.legend(loc="upper left")
    aux_ax.legend(loc="upper right")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, name+'_2.jpg'), dpi=100) 
    
    fig, ax = plt.subplots(1,1, figsize=(12,4))

    ax.plot(t_speed, word_speed, color='green', label="Velocidad en palabras")
    ax.plot(t_speed, word_speed, '.', markersize=20, color='green')
    aux_ax = ax.twinx()
    aux_ax.plot(t_speed, phoneme_speed, color='yellow', label="Velocidad en fonemas")
    aux_ax.plot(t_speed, phoneme_speed, '.', markersize=20, color='yellow')
    ax.set_xlabel('Tiempo (s)')
    ax.set_ylabel('Palabras/minuto')
    aux_ax.set_ylabel('Fonemas/minuto')
    
    ax.legend(loc="upper left")
    aux_ax.legend(loc="upper right")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, name+'_3.jpg'), dpi=100) 
    
    fig, ax = plt.subplots(1,1, figsize=(12,4))
    
    ax.hist(pause_segments, bins=[0, 0.5, 1, 1.5, 2], color='gray')
    ax.set_xlabel('Tiempo (s)')
    ax.set_ylabel('Cantidad de pausas')

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, name+'_4.jpg'), dpi=100) 

def generar_graficos(name, output_dir, t_audio, audio, pause_array, allo_aligned_dst, time, t_speed, word_speed, phoneme_speed, pause_segments):
    """Genera gráficos a partir de resultados del análisis. Los 4 en 1.
    
    Args:
        name (string): nombre de archivo a guardar
        output_dir (string): Carpeta donde se almacenan los gráficos
        t_audio (np array): instantes de tiempo de audio según frecuencia de muestreo
        audio (np array): vector de muestras de audio
        pause_array (np array): indica con 1 pausa detectada
        allo_aligned_dst (np array): Distancia de edición calculada por Allosarus luego de MFA
        time (np array): Vector temporal de análisis de similitud
        t_speed (np array): vector de tiempos para velocidad
        word_speed (np array): velocidad en palabras por segundos según t_speed
        phoneme_speed (np array): velocidad en fonemas por segundos según t_speed
        pause_segments (np array):Vector con duración de pausas

    Returns:
        None
    """
    
    fig, ax = plt.subplots(4,1, figsize=(12,20))
    plt.rcParams.update({'font.size': 15})

    ax[0].plot(t_audio, audio, 'b', label="Forma de Onda")
    ax[0].set_xlabel('Tiempo (s)')
    ax[0].set_ylabel('Amplitud')
    ax[0].plot(t_audio, pause_array, color='gray', label="Pausas")
    ax[0].axes.get_yaxis().set_ticks([-1, -0.5, 0, 0.5, 1])
    
    #Suaviza vector de distancia de edición
    kernel_len = 3
    kernel_half = int(kernel_len/2)
    aux_dst = np.zeros(len(allo_aligned_dst)+kernel_len)
    aux_dst[kernel_half:-kernel_half-1] = allo_aligned_dst
    dst_mean = np.zeros(len(allo_aligned_dst))
    for i in range(len(allo_aligned_dst)):
        dst_mean[i] = np.mean(aux_dst[i:i+kernel_len])

    ax[1].plot(time, dst_mean, color='orange', label="Error")
    ax[1].set_xlabel('Tiempo (s)')
    ax[1].set_ylabel('Distancia de edición')

    ax[2].plot(t_speed, word_speed, color='green', label="Velocidad en palabras")
    ax[2].plot(t_speed, word_speed, '.', markersize=20, color='green')
    aux_ax2 = ax[2].twinx()
    aux_ax2.plot(t_speed, phoneme_speed, color='yellow', label="Velocidad en fonemas")
    aux_ax2.plot(t_speed, phoneme_speed, '.', markersize=20, color='yellow')
    ax[2].set_xlabel('Tiempo (s)')
    ax[2].set_ylabel('Palabras/minuto')
    aux_ax2.set_ylabel('Fonemas/minuto')

    ax[3].hist(pause_segments, bins=[0, 0.5, 1, 1.5, 2], color='gray')
    ax[3].set_xlabel('Tiempo (s)')
    ax[3].set_ylabel('Cantidad de pausas')

    ax[0].legend(loc="lower right")
    ax[1].legend(loc="upper left")
    ax[2].legend(loc="upper left")
    aux_ax2.legend(loc="upper right")

    plt.tight_layout()

    plt.savefig(os.path.join(output_dir, name+'.jpg'), dpi=100) 

def evaluacion_audio(input_dir, output_dir, filename, text_char_count, phon_error_th, min_pause, use_mfa=True):
    """Calcula indicadores temporales y generales (pausas, velocidad, similitud, repeticiones) para archivo de audio
    indicado.

    Args:
        input_dir (string): Carpeta donde se encuentra el archivo deseado
        output_dir (string): Carpeta donde se almacenan resultados de MFA
        filename (string): Nombre del archivo sin extensión (asume .wav)
        text_char_count(int): Cantidad de caracteres del texto
        phon_error_th(int): Porcentaje de error máximo de fonemas para marcar error
        min_pause(int): Pausa mínima para indicar silencio
        use_mfa (boolean): Mediante True indica su uso. Es el indicador que lleva más tiempo en ejecutar
        
    Returns:
        indicadores(dict): Dicccionario con indicadores calculados normalizados a un minuto. 
        Estos valores son normalizados a un minuto
        
        t_audio (np array): instantes de tiempo de audio según frecuencia de muestreo
        audio (np array): vector de muestras de audio
        error (np array): indica con 1 que fue superado el umbral de error
        pause_array (np array): indica con 1 pausa detectada
        allo_aligned_dst (np array): Distancia de edición calculada por Allosarus luego de MFA
        reps_array (np array): indica con 1 repeticiones en fonemas luego de alinear por MFA
        time_mfa (np array): Vector temporal de análisis de similitud por MFA
        time_speed (np array): vector de tiempos para velocidad
        word_speed (np array): velocidad en palabras por segundos según t_speed
        phoneme_speed (np array): velocidad en fonemas por segundos según t_speed
        pause_segments (np array):Vector con duración de pausas
    """
    #Necesita esta frecuencia de muestreo para Vosk
    AUDIO_SR =  16000 

    #Lectura del archivo de audio
    audio, sr = librosa.load(os.path.join(input_dir, filename+'.wav'), sr=AUDIO_SR, dtype=np.float32)
    
    audio = audio - np.mean(audio)
    audio = audio/np.max(audio)    
    
    audio_len = len(audio)
    t_audio = np.linspace(0, audio_len/sr, audio_len)
    
    #Texto
    transcription = ''

    with open(os.path.join(input_dir, filename+'.lab'), 'r') as reader:
        line = reader.readline()
        while line != '':  # The EOF char is an empty string
            transcription += line
            line = reader.readline()
    
    #Calculo de indicadores
    #Alineación
    MFA_WINDOW_SEC = 5
    MFA_HOP_SEC = 3

    t1_start = perf_counter()

    if use_mfa == True:
        error_code, error_allo_1, error_words, error_words_time, reps_words, \
        reps_time, reps_array, error, allo_aligned_dst, time_mfa \
        = get_similarity_aligned(input_dir, filename, output_dir, audio, sr, MFA_WINDOW_SEC, MFA_HOP_SEC, phon_error_th)
    else:
        #For debugging purposes
        error_allo_1 = 100
        error_words = ['error', 'prueba']
        error_words_time = [0.2, 1.0]
        reps_words = []
        reps_time = 0
        reps_array = np.zeros(8) 
        error = np.zeros(8)
        allo_aligned_dst = [46.0, 24.0, 19.0, 24.0, 37.0, 21.0, 28.0, 23.0, 27.0]
        time_mfa = [2.5, 5.5625, 8.625, 11.6875, 14.75, 17.8125, 20.875, 23.9375, 27.0]

    t1_stop = perf_counter()
    print("Tiempo de sim. aligned: " + "{:.2f}".format(t1_stop - t1_start) + " segundos")

    error_words_count = len(error_words)
    
    #Velocidad
    SPEED_WINDOW_SEC = 10
    SPEED_HOP_SEC = 5

    t1_start = perf_counter()

    word_speed, phoneme_speed, time_speed = \
    speed_indicator(input_dir, audio, sr, SPEED_WINDOW_SEC, SPEED_HOP_SEC)

    t1_stop = perf_counter()
    print("Tiempo de velocidad: " + "{:.2f}".format(t1_stop - t1_start) + " segundos")

    #Pausas
    t1_start = perf_counter()
    
    error_allo_2, reps, rep_count, pause_array, pause_segments = get_rep_sim_pauses_indicator(audio, sr, transcription, input_dir, min_pauses=min_pause)
    silence_count = len(pause_segments)

    t1_stop = perf_counter()
    print("Tiempo de pausas: " + "{:.2f}".format(t1_stop - t1_start) + " segundos")
    
    #Puntaje según cantidad de caracteres de texto y errorres de edición
    puntaje = round(max(0, 100*(1-(error_allo_1/text_char_count)**3)))

    print("Error Allosaurus sin normalizar: {0}".format(error_allo_1))
    print("Largo del texto: {0}".format(text_char_count))

    #Normalización de resultados a 1 minuto
    factor = (audio_len/sr)/60
    error_allo_1 = int(error_allo_1/factor)
    error_allo_2 = int(error_allo_2/factor)
    #No normalizados
    if len(word_speed) > 0:
        word_speed_avg = int(np.mean(word_speed))
    else:
        word_speed_avg = "No disponible"
    if len(phoneme_speed) > 0:
        phoneme_speed_avg = int(np.mean(phoneme_speed))
    else:
        phoneme_speed_avg = "No disponible"
    
    indicadores = {
        "puntaje": puntaje,
        "error_general_allosaurus": error_allo_1,
        "cantidad_palabras_con_error": error_words_count,
        "cantidad_de_silencios": silence_count,
        "error_similitud": error_allo_2,
        "cantidad_de_repeticiones": rep_count,
        "palabras_con_errores": error_words,
        "tiempo_errores": error_words_time,
        "palabras_con_repeticiones": reps_words,
        "tiempo_repeticiones": reps_time,
        "fonemas_repetidos": reps,
        "velocidad_palabras": word_speed_avg,
        "velocidad_fonemas": phoneme_speed_avg
    }

    return indicadores, t_audio, audio, error, pause_array, allo_aligned_dst, reps_array, time_mfa, time_speed, word_speed, phoneme_speed, pause_segments

def analisis_audio(input_dir, filename, audio_ext, text, use_mfa=True):
    """Analiza audio 'filename' de entrada en 'input_dir' con transcripción en 'text'
        Almacena resultados en carpeta 'results' dentro de input_dir
    Args:
        input_dir (string): Directorio de ubicación del archivo de audio
        filename (string): Nombre del archivo de audio
        audio_ext(string): formato de audio (.mp3)
        text (string): Texto de transcripción
        use_mfa (boolean): Mediante True indica su uso. Es el indicador que lleva más tiempo en ejecutar
    """
    print("Analizando archivo {0}".format(filename))
    
    text_char_count = sum(len(line) for line in text.split(" "))

    #Entrada necesaria para MFA
    generate_lab_file(input_dir, filename, text)
    
    #Crea carpetas de MFA
    mfaInFolder = os.path.join(input_dir, 'mfa_in')
    mfaOutFolder = os.path.join(input_dir, 'mfa_out')

    try:
        os.mkdir(mfaInFolder)
        os.mkdir(mfaOutFolder)
    except OSError as error:
        print(error)

    #Mueve archivos a carpeta MFA
    set_up_mfa_folder(input_dir, mfaInFolder, filename, audio_ext)
    
    printFolder = os.path.join(input_dir, 'resultado')

    try:
        os.mkdir(printFolder)
    except OSError as error:
        print(error)

    #Analiza audio
    t1_start = perf_counter()
    indicadores, t_audio, audio, error, pause_array, allo_aligned_dst, reps_array, time_mfa, \
        t_speed, word_speed, phoneme_speed, pause_segments = \
            evaluacion_audio(mfaInFolder, mfaOutFolder, filename, text_char_count, PHON_ERROR_TH, MIN_PAUSES, \
            use_mfa=use_mfa)

    t1_stop = perf_counter()
    print("Tiempo de análisis: " + "{:.2f}".format(t1_stop - t1_start) + " segundos")

    #Guarda JSON 
    with open(os.path.join(printFolder, 'indicadores.json'), 'w') as fp:
        json.dump(indicadores, fp, sort_keys=True, indent=3)
        
    #Guarda imagenes en carpeta auxiliar
    generar_graficos('graficos', printFolder, t_audio, audio, pause_array, allo_aligned_dst, time_mfa, t_speed, word_speed, phoneme_speed, pause_segments)
    generar_graficos_individuales('graficos', printFolder, t_audio, audio, pause_array, allo_aligned_dst, time_mfa, t_speed, word_speed, phoneme_speed, pause_segments)

    print("Finalizó análisis")

if __name__ == '__main__':
    analisis_audio(INPUT_DIR, FILENAME, AUDIO_EXT, TEXT, use_mfa=True)