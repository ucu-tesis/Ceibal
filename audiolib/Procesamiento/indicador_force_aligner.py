'''
Created on Mon Sep 12 2022 06:56:47

indicador_force_aligner.py: Alinea audio con texto mediante técnica MFA (Montreal Forced Aligner).
Devuelve medida general de similitud entre texto y palabras; serie temporal con 
valores de similitud y repeticiones

Long description

https://montreal-forced-aligner.readthedocs.io/en/latest/getting_started.html
Tim Mahrt. PraatIO. https://github.com/timmahrt/praatIO, 2016.

project: Procesamiento de audio para evaluación de lectura
@author: Leonardo Martinez Hornak
email: lmartinez@ceibal.edu.uy
Copyright (c) 2022 Ceibal
'''
from re import sub
import subprocess

from praatio import textgrid

from scipy import io, signal
from scipy.io.wavfile import read
import soundfile as sf

import numpy as np
import matplotlib.pyplot as plt

from allosaurus.app import read_recognizer

import epitran
import panphon
from panphon import distance

import os
import time

INPUT_DIR = './input/outloud/tmp_speaker/' #Debe contener .lab con trascripción y archivo de audio
OUTPUT_DIR = './output/tmp_speaker/'
FILENAME = 'outloud_004'

MFA_ACOUSTIC_MODEL = "spanish_mfa"
MFA_DICT = 'spanish_latin_america_mfa'

def process_text_grid(folder, filename, audio, sr):
    """Procesa text grid de alineación utilizando praatio.
    Devuelve array de diccionarios con largo igual a cantidad de palabras del texto

    Args:
        folder (string): Carpeta donde se encuentra textgrid
        filename (string): nombre del archivo
        audio (numpy array): array de muestras de audio
        sr (int): frecuencia de muestreo

    Returns:
        dict_array: Array de diccionarios con los siguientes campos: start, end, word,
        allo_phones, text_ipa, dst_allo
    """
    allosaurus_model = read_recognizer()
    epi = epitran.Epitran('spa-Latn')
    dst_measure = panphon.distance.Distance()

    #Lectura de archivo textgrid
    tg = textgrid.openTextgrid(os.path.join(folder, filename+'.TextGrid'), False)

    entryList_words = tg.getTier("words").entryList
    entryList_phones = tg.getTier("phones").entryList

    #Crea diccionario con palabras
    dict_array = [{'start':w.start, 'end':w.end, 'word':w.label} for w in entryList_words] 

    #Agrega fonemas al diccionario según momento de detección
    word_count = len(dict_array)

    for w in range(word_count):
        w_start = dict_array[w]['start']
        w_end = dict_array[w]['end']

        #Generate phonemes with allosaurus
        n_start = int(w_start*sr)
        n_end = int(w_end*sr)

        audio_silence = add_silence_to_audio(audio[n_start:n_end], sr)
        
        sf.write(os.path.join(folder, 'test.wav'), audio_silence, sr)
        allo_phones = allosaurus_model.recognize(os.path.join(folder, 'test.wav'),'spa')

        allo_phones = allo_phones.replace(' ','')

        dict_array[w]['allo_phones'] = allo_phones

        #Generate ideal phonemes from text
        dict_array[w]['text_ipa'] = epi.transliterate(dict_array[w]['word'])

        #Calculate distances
        dict_array[w]['dst_allo'] = dst_measure.levenshtein_distance(source=allo_phones, target=dict_array[w]['text_ipa'])

    return dict_array

def add_silence_to_audio(audio, sr, silence_duration=0.5):
    """Agrega instantes de silencio con ruido randómico antes y luego del array de audio con una duración 
    de  silence_duration en segundos

    Args:
        audio (numpy array): Muestras de audio
        sr (int): Frecuencia de muestreo
        silence_duration (int): Duración de silencio en segundos

    Returns:
        audio_silence(numpy array): Señal de audio con silencio al principio y final
    """

    #Normalizes audio signal
    aux = audio - np.mean(audio)
    aux = audio/np.max(audio)
    L = len(audio)

    silence_samples = int(silence_duration*sr)
    audio_silence = 0.01*(2*np.random.rand(int(L + 2*silence_samples)) - 0.5)
    audio_silence[silence_samples:silence_samples+L] = aux

    return audio_silence


# Funcion que busca todos los substrings que se repiten en el string con largo entre 2 y 10
# Ademas chequea que al menos una vez dicha repetecion sea consecutiva
def find_repetitions(input_string):

   # obtengo largo del string
   length = len(input_string)

   # elimino espacios en blanco (No necesario en este archivo)
   #input_string = input_string.replace(' ','')                                              

   # saco lista de substrings
   lista_substrings = [input_string[i:j+1] for i in range(length) for j in range(i,length)]
   # elimino duplicados
   lista_substrings = np.unique(lista_substrings)                                            

   # guardo solo repetidos
   lista_substrings = [x for x in lista_substrings if (input_string.count(x)>1)]            
   
   # filtro largo entre 2 y 10
   lista_substrings = [x for x in lista_substrings if ((len(x)>1) & (len(x)<=10))]          

   # ordeno por largo
   lista_substrings.sort(key=len)                                                          

   # filtro solo repeticiones consecutivas
   lista_substrings = [x for x in lista_substrings if (input_string.count(x*2)>0)]          

   # obtengo la lista de los indices donde ocurren las repeticiones
   lista_indices = [input_string.index(x) for x in lista_substrings if (input_string.count(x*2)>0)]          

   return lista_substrings, lista_indices

def get_similarity_aligned(input_folder, filename, output_folder, audio_samples, audio_sr, win_size_seconds, hop_seconds, error_threshold):
    """Devuelve medidas de similitud luego de alinear la transcripción con el audio mediante la técnica MFA (Montreal Force Aligner)

    Args:
        input_folder (string): Ruta donde se encuentra el archivo a leer
        filename (string): Nombre del archivo sin extensión
        output_folder (string): Ruta donde se almacenarán archivos de uso temporales
        audio_samples (numpy array): Muestras de audio normalizadas
        audio_sr (int): Frecuencia de muestreo de audio
        win_size_seconds (int): Tamaño de la ventana de análisis en segundos
        hop_seconds (int): Tamaño del salto en segundos
        error_threshold (float): Porcentaje de fonemas mínimo para indicar error

    Returns:
        error_code: True si hubo error ejecutando MFA, False si realizó alineación
        allo_general_score: Error de similitud general usando Allosaurus y levenhstein
        error_words: palabras donde el error superó el umbral
        error_words_time: Array de tiempos donde ocurre error de palabra
        reps_words: palabras donde hubo repetición
        reps_time: Array de tiempos donde ocurre la repetición
        reps_array: Array donde 1 indica que hubo repetición y 0 no. Not implemented
        error: Array donde 1 indica que se superó umbral de error y 0 no.
        allo_aligned_dst: Array de distancia de edición según fonemas detectados por Allosaurus
        mfa_time: Array de tiempo en segundos según win_size_seconds y hop_seconds
    """
    #Alineación
    #print("Realizando alineación...")
    #Quiet does not seem to be working with clean at the same time
    std_out = subprocess.run(
        ["mfa", "align", input_folder, MFA_DICT, MFA_ACOUSTIC_MODEL, output_folder, "--clean"],
        # ["mfa", "align", input_folder, MFA_DICT, MFA_ACOUSTIC_MODEL, output_folder, "--clean", "--silent"],
        capture_output=True
    )

    #arrays de salida
    allo_aligned_dst = [0]
    error = np.zeros(1) 
    character_count = [0]
    reps_array = np.zeros(1)
    mfa_time = np.zeros(1)
    error_words = []
    error_words_time = []
    reps_words = []
    reps_time = []
    allo_general_score = 0
    error_code = False

    if std_out.returncode != 0:
        print("Error en MFA")
        reps_words = ["0"]
        reps_time = [0.0]
        error_code = True
    else:
        print("Alineación realizada.")

        dict_array = process_text_grid(output_folder, filename, audio_samples, audio_sr)

        #Enventanado
        #Cálculo de diccionario de análisis según saltos y tamaño de ventana de analisis
        total_samp = audio_samples.shape[0]
        # ventana de análisis
        win_samp = int(audio_sr*win_size_seconds)
        # salto entre ventanas
        hop_samp = int(audio_sr*hop_seconds)
        
        dict_len = int((total_samp-win_samp)/hop_samp)

        allo_aligned_dst = np.zeros(dict_len)
        error = np.zeros(dict_len)
        character_count = np.zeros(dict_len)
        reps_array = np.zeros(dict_len)

        #frecuencia de muestreo de señal de salida
        mfa_time = np.linspace(win_size_seconds/2, hop_samp*dict_len/audio_sr, dict_len)
        
        #Veo si hay palabras detectadas dentro de cada ventana y agrego a los vectores
        word_start = 0   #Index used to spend less time looping

        n_words = len(dict_array)

        for i in range(dict_len):
            frame_start_time = i*hop_samp
            frame_end_time = frame_start_time + win_samp

            for w in range(word_start, n_words):
                #No considera palabras detectadas como "spoken noise (spn)". Sólo se marcan, la detección de similitud es con Allosaurus
                #if dict_array[w]["mfa_phones"] == 'spn':
                #    print("Palabra '{0}' no reconocida por MFA".format(dict_array[w]["word"]))
                
                word_start_time = audio_sr*dict_array[w]["start"]
                word_end_time = audio_sr*dict_array[w]["end"]
                word_char_count = len(dict_array[w]["word"])
                
                #Verifica que la palabra esté dentro de la ventana
                if word_start_time >= frame_start_time and word_end_time <= frame_end_time:
                    allo_aligned_dst[i] += dict_array[w]["dst_allo"]
                    character_count[i] += word_char_count

                    #Pasa una sola vez por palabra por aca
                    allo_general_score += int(dict_array[w]["dst_allo"])

                    #Observa repeticiones de fonemas por palabra
                    #reps, _ = find_repetitions(dict_array[w]["allo_phones"])
                    #if len(reps) > 0:
                    #    reps_words.append(dict_array[w]["word"])
                    #    reps_time.append(dict_array[w]["start"])
                    #    reps_array[i] += 1

                    if word_char_count > 0:
                        aux = dict_array[w]["dst_allo"] / word_char_count
                        if aux > error_threshold:
                            error_words.append(dict_array[w]["word"])
                            error_words_time.append(dict_array[w]["start"])
                elif word_start_time <= frame_end_time:
                    #Caso que palabra supera al largo de la ventana
                    #Se considera en esta ventana y se descara para próxima pasada
                    allo_aligned_dst[i] += dict_array[w]["dst_allo"]
                    character_count[i] += word_char_count

                    #Pasa una sola vez por palabra por aca
                    allo_general_score += int(dict_array[w]["dst_allo"])

                    #Observa repeticiones de fonemas por palabra
                    #reps, _ = find_repetitions(dict_array[w]["allo_phones"])
                    #if len(reps) > 0:
                    #    reps_words.append(dict_array[w]["word"])
                    #    reps_time.append(dict_array[w]["start"])
                    #    reps_array[i] += 1

                    if word_char_count > 0:
                        aux = dict_array[w]["dst_allo"] / word_char_count
                        if aux > error_threshold:
                            error_words.append(dict_array[w]["word"])
                            error_words_time.append(dict_array[w]["start"])

                    word_start = w+1
                    break
                else:
                    word_start = w
                    break
                
            #Actualiza vector de error del frame
            if character_count[i] > 0:
                aux = allo_aligned_dst[i] / character_count[i]
                if aux > error_threshold:
                    error[i] = 1

    return error_code, allo_general_score, error_words, error_words_time, reps_words, reps_time, reps_array, error, allo_aligned_dst, mfa_time

if __name__ == '__main__':

    sr, audio = io.wavfile.read(INPUT_DIR + FILENAME + '.wav')
    audio = audio - np.mean(audio)
    audio = audio/np.max(audio)
    L = len(audio)
    t_audio = np.linspace(0, L/sr, L)

    allo_general_score, error_words, error_words_time, reps_words, reps_time, reps_array, error, \
        allo_aligned_dst, time = \
            get_similarity_aligned(INPUT_DIR, FILENAME, OUTPUT_DIR, audio, sr, 5, 1, 0.5)

    print("Error general Allosaurus: {0}".format(allo_general_score))
    print("Palabras con errores mayor al umbral: {0}".format(error_words))
    print("Tiempo inicio - errores en palabras: {0}".format(error_words_time))

    print("Palabras con repeticiones: {0}".format(reps_words))
    print("Tiempo inicio - repeticiones: {0}".format(reps_time))

    fig, ax = plt.subplots(2,1, figsize=(12,8))

    ax[0].plot(t_audio, audio, 'b')
    ax[0].set_xlabel('Tiempo (s)')
    ax[0].set_ylabel('Amplitud')
    ax[0].set_title('Forma de onda señal')

    ax[1].plot(time, error, color='red', label="Error en palabras")
    ax[1].plot(time, allo_aligned_dst, color='black', label="Distancia Allosaurus")
    ax[1].plot(time, reps_array, color='blue', label="Repeticiones")

    ax[1].set_xlabel('Tiempo (s)')
    ax[1].set_ylabel('Indicadores temporales')
    ax[1].set_title('Resultados')

    ax[1].legend(loc="upper left")

    plt.tight_layout()
    plt.savefig(OUTPUT_DIR + "prueba_mfa.jpg", dpi=100)
    plt.show()