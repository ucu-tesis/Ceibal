import React, { useRef, useState, useEffect } from "react";
import StopButton from "./buttons/StopButton";
import PlayButton from "./Buttons/PlayButton";
import RecordButton from "./buttons/RecordButton";
import PrimaryButton from "./buttons/PrimaryButton";

interface RecorderProps {
  onComplete: (audioBuffer: ArrayBuffer, mimeType: string) => void;
  newRecord: boolean;
}

const Recorder: React.FC<RecorderProps> = ({ onComplete, newRecord }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [bufferSource, setBufferSource] =
    useState<AudioBufferSourceNode | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (newRecord) {
      setArrayBuffer(null);
    }
  }, [newRecord]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const audioChunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      recorder.onstop = async () => {
        const mimeType = recorder.mimeType.split(";")[0];
        const blob = new Blob(audioChunks, { type: mimeType });
        const buffer = await new Response(blob).arrayBuffer();
        setArrayBuffer(buffer);
        onComplete(buffer, mimeType);
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const toggleAudioPlayback = async () => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }
    const currentContext = audioContext.current;

    if (arrayBuffer && !playing) {
      const newBufferSource = currentContext.createBufferSource();
      const buffer = await currentContext.decodeAudioData(arrayBuffer.slice(0));
      newBufferSource.buffer = buffer;
      newBufferSource.connect(currentContext.destination);
      newBufferSource.start(0);

      newBufferSource.onended = () => {
        setPlaying(false);
      };

      setBufferSource(newBufferSource);
      setPlaying(true);
    } else if (bufferSource && playing) {
      bufferSource.stop();
      setPlaying(false);
    }
  };

  return (
    <div id="recorder" className="row">
      <PrimaryButton variant={(recording ? "pink" : "") as keyof Object}>
        {recording ? "Parar" : "Grabar"}
      </PrimaryButton>

      {recording ? (
        <StopButton onClick={stopRecording} />
      ) : (
        <RecordButton onClick={startRecording} />
      )}

      {arrayBuffer && (
        <div>
          <button onClick={toggleAudioPlayback}>
            {playing ? "Pausar" : "Reproducir"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Recorder;
