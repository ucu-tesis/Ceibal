import numpy as np
import matplotlib.pyplot as plt
from scipy import io, signal
from scipy.io.wavfile import read
import soundfile as sf

import os

INPUT_DIR = './input/outloud/tmp_speaker/' #Debe contener .lab con trascripción y archivo de audio
FILENAME = 'outloud_004'
OUTPUT_DIR = './output/'
N_FFT = 1024

#Funciones auxiliares

def calculate_energy(x, N):
    """
    Calcula energía de forma recursiva para una ventana rectangular
    
    Parameters
    ----------
    x (numpy array)  : entrada de audio
    N (int) : cantidad de muestras utilizadas
    
    Returns
    -------
    energy (numpy array) : señal de energía
    
    """
    L = len(x)
    energy = np.zeros(L)
   
    #Valor inicial
    energy[0] = x[0]**2

    for i in range(L-1):
        #Espera una ventana de largo N para poder considerar su efecto.
        if i < N:
            energy[i+1] = x[i+1]**2 + energy[i]
        else:
            energy[i+1] = x[i+1]**2 + energy[i] - x[i+1-N]**2

    return energy

def calculate_sign(x):
    """
    Calcula signo según definición
    
    Parameters
    ----------
    x (int)  : muestra de audio
    
    Returns
    -------
    y (int) : valor 1 si x mayor o igual a 0, -1 si es menor a 0
    
    """

    y = 1

    if x < 0:
        y = -1

    return y

def calculate_zerocrossing(x, N):
    """
    Calcula tasas de cruces por cero para N muestras
    
    Parameters
    ----------
    x (numpy array)  : entrada de audio
    N (int) : cantidad de muestras utilizadas
    
    Returns
    -------
    zero_crossing (numpy array) : señal de cruces por cero
    
    """
    L = len(x)
    zero_crossing = np.zeros(L)
   
    #Valor inicial
    zero_crossing[0] = 0

    for i in range(L-1):
    
        #Espera una ventana de largo N para poder considerar su efecto.
        if i < N:
            zero_crossing[i+1] = zero_crossing[i] + (1/(2*N)) * np.abs(calculate_sign(x[i+1]) - calculate_sign(x[i]))
        else:
            zero_crossing[i+1] = zero_crossing[i] + (1/(2*N)) * (np.abs(calculate_sign(x[i+1]) - calculate_sign(x[i])) - np.abs(calculate_sign(x[i+1-N]) - calculate_sign(x[i-N])))

    return zero_crossing


def vad_simple(x, sr, N_ms_energy=100, N_ms_zc=10, thr_energy=1, thr_zc=50, filter_segments=True, min_silence_ms=100, min_speech_ms=100):
    """
    Devuelve segmentos en milisegundos donde detecta audio.
    Utiliza umbrales para energía y cruces por cero.
    
    Parameters
    ----------
    x (numpy array)  : entrada de audio normalizada
    sr (int) : frecuencia de muestreo de x
    N_ms_energy (int) : cantidad de muestras en ms utilizadas para calculo de energia
    N_ms_zc (int) : cantidad de muestras en ms utilizadas para calculo de cruces por cero
    thr_energy (float) : porcentaje respecto a la energía normalizado utilizado como 
    umbral discriminante
    thr_zc (float) : porcentaje respecto al cruce por ceros normalizado utilizado como 
    umbral discriminante
    filter_segments (boolean): filtra segmentos de vad uniendo segmentos cercanos según min_silence_s y remueve los que tienen
    duracion menor a min_speech_s luego del filtrado.
    min_silence_ms (float) : Separación mínima de espacios de silencio en milisegundos
    min_speech_ms (float) : Tiempo mínimo de voz en milisegundos
    
    Returns
    -------
    segments (numpy array) : Array con segments donde cada uno indica el inicio y final en milisegundos
    
    """
    L = len(x)
    mask = np.zeros(L)
    
    #Ventana de muestras
    N_energy = int(sr * N_ms_energy/1000)
    N_zc = int(sr * N_ms_zc/1000)
    
    #Calculo energía. Normalizo.
    audio_energy = calculate_energy(x, N_energy)
    audio_energy = audio_energy / np.max(audio_energy)

    #Calculo cruces por cero (ventana de 10 ms). Normalizo.
    audio_zerocrossing = calculate_zerocrossing(x, N_zc)
    audio_zerocrossing = audio_zerocrossing / np.max(audio_zerocrossing)

    #Enmascaro según "Energy" y umbral establecido
    thr = thr_energy/100
    mask_energy = np.array(audio_energy > thr)

    #Enmascaro según "Zero Crossing" y umbral establecido
    thr = thr_zc/100
    mask_zero_crossing = np.array(audio_zerocrossing > thr)

    #Zonas donde haya energía y fonemos sordos, constituye la segmentación de palabras
    mask = mask_energy | mask_zero_crossing
    
    #Transforma zonas a recortes de audio
    start_segment = 0
    end_segment = 0

    segments = []

    initial_value = False

    for i in range(len(mask)-1):
        if i == 0:
            if mask[i] == True:
                start_segment = i
        else:
            if mask[i] == True and mask[i-1] == False:
                start_segment = i
            elif mask[i] == False and mask[i-1] == True:
                end_segment = i

                segments.append([start_segment, end_segment])

    if filter_segments == True:
        #Recorro segmentos y realizo este filtrado
        #Junto segmentos cercanos en min_silence_ms
        #Elimino segmentos restantes si son menores a min_speech_ms
        
        segments_filter = []
        
        min_silence_gap = (min_silence_ms*sr)/1000

        for s_len in range(len(segments)):
            if s_len == 0:
                start_segment = segments[0][0]
                end_segment = segments[0][1]
            else:
                if segments[s_len][0] - end_segment < min_silence_gap:
                    #Uno los segmentos, la separacion es chica
                    end_segment = segments[s_len][1]
                else:
                    #Almaceno elemento anterior y marco el nuevo comienzo
                    segments_filter.append([start_segment, end_segment])
                    start_segment = segments[s_len][0]
                    end_segment = segments[s_len][1]
        
        min_speech_length = (min_speech_ms*sr)/1000
        segments = []
        segment_size = [abs(a[0]-a[1]) for a in segments_filter]
        segments = np.delete(segments_filter, np.argwhere(np.array(segment_size) < min_speech_length), axis=0)

    return segments


#Configuración modelo silero
SAMPLING_RATE = 16000

import torch
torch.set_num_threads(1)

from pprint import pprint

# TODO set USE_ONNX to True like it was previously. Its set to false to prevent warnings and optimize startup
# but its unclear what the impact is in the final result
USE_ONNX = False # change this to True if you want to test onnx model
#if USE_ONNX:
#    get_ipython().system('pip install -q onnxruntime')

silero_model, silero_utils = torch.hub.load(repo_or_dir='snakers4/silero-vad',
                              model='silero_vad',
                              force_reload=False, # TODO check this, it was previously True
                              onnx=USE_ONNX)


def vad_silero(x, sr, silero_model, silero_utils, min_silence_ms=50, min_speech_ms=100):
    """
    Devuelve segmentos en muestras donde detecta audio utilizando silero.
    
    Parameters
    ----------
    x (numpy array)  : entrada de audio normalizada
    sr (int) : frecuencia de muestreo de x. Debe ser 16kHz!
    silero_model : Instancia de modelo silero
    silero_utils : Instancia de utilidades silero
    min_silence_ms (float) : Separación mínima de espacios de silencio en milisegundos
    min_speech_ms (float) : Tiempo mínimo de voz en milisegundos
    
    Returns
    -------
    segments (numpy array) : Array con segments donde cada uno indica el inicio y final en milisegundos
    
    """
    
    (get_speech_timestamps, save_audio, read_audio, VADIterator, collect_chunks) = silero_utils
    
    speech_timestamps = get_speech_timestamps(x, silero_model, sampling_rate=sr, min_speech_duration_ms=min_speech_ms, min_silence_duration_ms=min_silence_ms)
    
    segments = []
    
    for sp in speech_timestamps:
        segments.append([sp['start'], sp['end']])

    return segments


#WebRTC
import webrtcvad
vad_model_webrtc = webrtcvad.Vad()

#Establece agresividad de filtrado. 3 es más agresivo
vad_model_webrtc.set_mode(1)

def vad_webrtc(x, sr, vad_model, frame_duration_ms=10):
    """
    Devuelve segmentos en milisegundos donde detecta audio utilizando silero.
    
    Parameters
    ----------
    x (numpy array)  : entrada de audio normalizada. Espero señal del tipo flotante.
    sr (int) : frecuencia de muestreo de x
    vad_model : modelo utilizado
    frame_duration_ms(float) : duración utilizada por el modelo. Soporta valores de 5, 10, 15 ms.
    
    Returns
    -------
    segments (numpy array) : Array con segments donde cada uno indica el inicio y final en muestras según sr
    
    """
    
    #TODO Entender por qué modelo usa 10, 20 y 30 pero funciona así.
    frame_size = int((frame_duration_ms * sr) / 1000)
    num_frames = int(len(x)/frame_size)

    mask = np.zeros(len(x))

    for n_f in range(num_frames):
        #Conversión necesaria para webrtc (entero de 16 bits, formato bytes)
        chunk = np.array([int(a*32768) for a in x[n_f*frame_size:(n_f+1)*frame_size]], dtype=np.int16)
        chunk_bytes = chunk.tobytes()

        speech = vad_model.is_speech(chunk_bytes, sr)

        if speech == True:
            mask[n_f*frame_size:(n_f+1)*frame_size] = 1
    
    #Transforma zonas a recortes de audio
    start_segment = 0
    end_segment = 0

    segments = []

    initial_value = False

    for i in range(len(mask)-1):
        if i == 0:
            if mask[i] == True:
                start_segment = i
        else:
            if mask[i] == True and mask[i-1] == False:
                start_segment = i
            elif mask[i] == False and mask[i-1] == True:
                end_segment = i

                segments.append([start_segment, end_segment])

    return segments

def plot_compare_vads(x, sr, segments_simple, segments_silero, segments_webrtc, time_limits=None, saveImage=False, filename="vad_segments.jpg"):
    """
    Grafica forma de onda de señal, su espectro y superpuesto, con vad superpuesto para cada método
    
    Parameters
    ----------
    x (numpy array)  : entrada de audio
    sr (int)         : frecuencia de muestreo en Hz
    segments_simple (numpy array): segmento que marcan inicio y final de zona de voz detectada con vad simple
    segments_silero (numpy array): segmento que marcan inicio y final de zona de voz detectada con silero
    segments_webrtc (numpy array): segmento que marcan inicio y final de zona de voz detectada con webrtc
    time_limits (numpy array)  : vector recorte eje temporal [trim_time_low,trim_time_high]
    saveImage (boolean) : si es True, almacena el gráfico en OUTPUT_DIR
    filename (string) : nombre de archivo a almacenar el gráfico
    Returns
    -------
    None
    
    """
    L = len(x)
    t = np.linspace(0, L/sr, L)
    
    #calculo máscara de los segmentos
    mask_simple = np.zeros(L)
    for sgm in segments_simple:
        mask_simple[sgm[0]:sgm[1]] = 1
        
    mask_silero = np.zeros(L)
    for sgm in segments_silero:
        mask_silero[sgm[0]:sgm[1]] = 1
    
    mask_webrtc = np.zeros(L)
    for sgm in segments_webrtc:
        mask_webrtc[sgm[0]:sgm[1]] = 1
        
    fig, axs = plt.subplots(3,1, figsize=(10,10))

    axs[0].plot(t, x)
    axs[0].plot(t, mask_simple, color='red')    
    axs[0].set_title("VAD - Simple")
    axs[0].set_ylabel('Amplitud')
    axs[0].set_xlabel('Tiempo (s)')
    
    axs[1].plot(t, x)
    axs[1].plot(t, mask_silero, color='red')    
    axs[1].set_title("VAD - Silero")
    axs[1].set_ylabel('Amplitud')
    axs[1].set_xlabel('Tiempo (s)')
    
    axs[2].plot(t, x)
    axs[2].plot(t, mask_webrtc, color='red')    
    axs[2].set_title("VAD - WebRTC")
    axs[2].set_ylabel('Amplitud')
    axs[2].set_xlabel('Tiempo (s)')
    
    #Zoom temporal
    if time_limits != None: 
        trim_time_low, trim_time_high = time_limits
                  
        axs[0].set_xlim([trim_time_low,trim_time_high])
        axs[1].set_xlim([trim_time_low,trim_time_high])
        axs[2].set_xlim([trim_time_low,trim_time_high])
                  
    plt.tight_layout()
    
    if saveImage:
        plt.savefig(OUTPUT_DIR + filename, dpi=100)



#Veo fonemas en segmentos con Allosaurus
import allosaurus

from allosaurus.app import read_recognizer
model = read_recognizer()

import epitran
epi = epitran.Epitran('spa-Latn')

import panphon

from panphon import distance
dst = panphon.distance.Distance()

# Funcion que busca todos los substrings que se repiten en el string con largo entre 2 y 10
# Ademas chequea que al menos una vez dicha repetecion sea consecutiva
def find_repetitions(input_string):

   # obtengo largo del string
   length = len(input_string)

   # elimino espacios en blanco
   input_string = input_string.replace(' ','')                                              

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

def create_array_pauses(voice_segments, signal_len, sr, min_pause=0):
    """Crea vector de pausas a partir de segmentos de voz. Sólo incluye las pausas mayore a min_pause

    Args:
        voice_segments (numpy array): Segmentos de voz detectados
        signal_len (int): largo de la señal en muestras
        sr (int): frecuencia de muestreo de señal de audio
        min_pause (int, optional): Pausa mínima. Defaults to 0.

    Returns:
        full_arr(numpy array): Vector de 0s y 1s donde 1 indica pausa
        silence_arr(array): Lista con duraciones de silencio que superen 'min_pause'
    """
    full_arr = np.zeros((signal_len,), dtype=int)
    silence_arr = []
    first = True

    for i,elem in enumerate(voice_segments):

        if first:
            first = False
        else:
            last = voice_segments[i-1][1]
            silence_duration = (elem[0] - last)/sr

            if silence_duration >= min_pause:
                silence_arr.append(silence_duration)

                # Load full_arr with 1 to indicate pause
                full_arr[last:elem[0]] = 1

    return full_arr, silence_arr

def get_voiced_segments_indicator(x, sr, text, folder):
    """
    Devuelve segmentos de voz en el vector de audio y similitud entre
    el vector de audio x muestreado a sr y la transcripción de texto
    
    Parameters
    ----------
    x (numpy array)  : entrada de audio (normalizada)
    sr (int)         : frecuencia de muestreo en Hz (debe ser de 16kHz)
    text (string) : trancripción del texto leído
    folder (string): ruta para guardar archivos temporales
    
    Returns
    -------
    voiced_segments (numpy array): segmentos de voz detectados
    distance (int): Distance de edición entre fonemas del texto con fonemas detectados.
   
    """
    reference_ipa = epi.transliterate(text)
    voiced_segments = vad_webrtc(x, sr, vad_model_webrtc)
    
    #Recorro todos los segmentos y agrego a transcripcion
    text_from_audio = ""
    
    for sgm in range(len(voiced_segments)):
        data_segment = x[voiced_segments[sgm][0]:voiced_segments[sgm][1]]
        
        #Utiliza segmentos de largo mayor a 100ms
        if len(data_segment) > 0.1*sr:
            sf.write(os.path.join(folder, 'test.wav'), data_segment, sr)
            output = model.recognize(os.path.join(folder, 'test.wav'),'spa')
            text_from_audio += output
    
    error = dst.levenshtein_distance(source=reference_ipa, target=text_from_audio)
    
    return voiced_segments, error, text_from_audio

def get_rep_sim_pauses_indicator(x, sr, text, folder, min_pauses=0.3):
    """
    Devuelve indicadores de repeticiones, similitud usando allosaurus y pausas
    
    Parameters
    ----------
    x (numpy array)  : entrada de audio (normalizada)
    sr (int)         : frecuencia de muestreo en Hz (debe ser de 16kHz)
    text (string) : trancripción del texto leído
    folder (string): ruta para guardar archivos temporales
    min_pauses(float): pausa mínima considerada para tiempo de silencio
    
    Returns
    -------
    segments (int): cantidad de segmentos de voz detectados
    distance (int): Distance de edición entre fonemas del texto con fonemas detectados.
    repetitions (array): Lista con fonemas repetitidos (pueden ser de a 2 o de a 10)
    repetitions_count (int): Cantidad de repeticiones observada en los fonemas
    """

    voiced_segments, distance, phonemes_string = get_voiced_segments_indicator(x, sr, text, folder)
    repetitions, lista_indices = find_repetitions(phonemes_string)
    repetitions_count = len(repetitions)

    pauseVoiceArray, pauseSegments = create_array_pauses(voiced_segments, len(x), sr, min_pause=min_pauses)

    return distance, repetitions, repetitions_count, pauseVoiceArray, pauseSegments

def get_transcription(filename):
    transcription = ''

    with open(filename, 'r') as reader:
        line = reader.readline()
        while line != '':  # The EOF char is an empty string
            transcription += line
            line = reader.readline()
    return transcription

if __name__ == '__main__':

    sr, audio = io.wavfile.read(INPUT_DIR+FILENAME+'.wav')
    audio = audio - np.mean(audio)
    audio = audio/np.max(audio)

    transcription = get_transcription(INPUT_DIR+FILENAME+'.lab')
    #transcription ="¿Nos ayudas a escribir lago en el cuaderno? Arrastra cada letra a su lugar para escribir cada palabra"

    distance, reps, reps_count, pause_array, pause_segments = get_rep_sim_pauses_indicator(audio, sr, transcription, min_pauses=0.4)

    print("Error general con Allosaurus: {0}".format(distance))

    print("Cantidad de repeticiones: {0}".format(reps_count))
    print("Lista con fonemas repetidos: {0}".format(reps))
    
    
    fig, ax = plt.subplots(2,1, figsize=(12,8))

    ax[0].plot(pause_array, 'red')
    ax[0].plot(audio, 'blue')
    ax[0].set_xlabel('Tiempo (s)')
    ax[0].set_ylabel('Amplitud')
    ax[0].set_title('Pausas')

    ax[1].hist(pause_segments)

    ax[1].set_xlabel('Tiempo (s)')
    ax[1].set_ylabel('Cantidad')
    ax[1].set_title('Histograma de pausas')

    ax[1].legend(loc="upper left")

    plt.tight_layout()
    plt.show()