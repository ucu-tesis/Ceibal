import React, { useRef, useState } from "react";
import RecordButton from "./Buttons/RecordButton";
import StopButton from "./Buttons/StopButton";

interface RecorderProps {
  onComplete: (audioBuffer: ArrayBuffer) => void;
}

const Recorder: React.FC<RecorderProps> = ({ onComplete }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [bufferSource, setBufferSource] =
    useState<AudioBufferSourceNode | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

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
        const blob = new Blob(audioChunks, { type: "audio/mpeg-3" });
        const buffer = await new Response(blob).arrayBuffer();
        setArrayBuffer(buffer);
        onComplete(buffer);
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
      currentContext.decodeAudioData(arrayBuffer, (buffer) => {
        newBufferSource.buffer = buffer;
        newBufferSource.connect(currentContext.destination);
        newBufferSource.start(0);
      });

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
    <div>
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
