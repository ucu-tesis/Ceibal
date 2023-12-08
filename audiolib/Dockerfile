FROM condaforge/miniforge3

WORKDIR /app/audiolib

RUN conda create -n audiodsp python=3.8 kaldi pynini

SHELL ["conda", "run", "-n", "audiodsp", "/bin/bash", "-c"]

RUN conda install montreal-forced-aligner pgvector hdbscan

RUN conda install onnxruntime webrtcvad

RUN pip install allosaurus

RUN pip install epitran vosk

RUN pip install torch torchvision torchaudio

# --- api requirements

RUN pip install fastapi

RUN pip install "uvicorn[standard]"

RUN pip install python-multipart

RUN mfa models download acoustic spanish_mfa
RUN mfa models download dictionary spanish_latin_america_mfa

RUN pip install psycopg2
RUN pip install requests

# RUN conda init bash && exec /bin/bash && conda activate audiodsp && \
#  conda install allosaurus epitran onnxruntime vosk

#RUN conda init bash && exec /bin/bash && conda activate audiodsp && \
#  conda install torch torchvision torchaudio webrtcvad

# conda run -n audiodsp uvicorn main:app
# conda run --no-capture-output -n audiodsp uvicorn main:app
# conda run --no-capture-output -n audiodsp python main.py
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "audiodsp", "python", "main.py"]
# ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "audiodsp", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0"]
#ENTRYPOINT ["tail", "-f", "/dev/null"]
