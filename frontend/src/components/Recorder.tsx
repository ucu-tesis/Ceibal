import React, { useRef, useState, useEffect } from "react";
import PrimaryButton from "./buttons/PrimaryButton";
import RecordIcon from "../assets/images/record_icon.svg";
import StopIcon from "../assets/images/stop_icon.svg";
import Image from "next/image";
import localFont from "next/font/local";
import SecondaryButton from "./buttons/SecondaryButton";
import RecordAgainIcon from "../assets/images/record_again_icon.svg";
import PlayIcon from "../assets/images/play_icon.svg";
import PauseIcon from "../assets/images/pause_icon.svg";

interface RecorderProps {
  onComplete: (audioBuffer: ArrayBuffer, mimeType: string) => void;
  newRecord?: boolean;
  onRecording: () => void;
  componentRef: React.LegacyRef<HTMLDivElement> | undefined;
}

const mozaicFont = localFont({
  src: [
    {
      path: "../assets/fonts/ceibalmozaic-regular-webfont.woff2",
      style: "normal",
    },
  ],
});

const Recorder: React.FC<RecorderProps> = ({ onComplete, newRecord, onRecording, componentRef }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [bufferSource, setBufferSource] = useState<AudioBufferSourceNode | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (newRecord) {
      setArrayBuffer(null);
    }
  }, [newRecord]);

  const startRecording = async () => {
    try {
      onRecording();
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
    const buttonElement = document.getElementById("primary-button") as HTMLElement;
    if (mediaRecorder) {
      buttonElement.style.transform = "scale(0.75)";
      setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
      }, 500);
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
    <div ref={componentRef} id="recorder" className="row">
      {arrayBuffer && !recording ? (
        <>
          <SecondaryButton onClick={startRecording} variant={"noFill" as keyof Object}>
            <div>
              <Image src={RecordAgainIcon} alt=""></Image>
            </div>
            <div style={{ fontFamily: mozaicFont.style.fontFamily }}>Grabar otra vez</div>
          </SecondaryButton>
          <SecondaryButton onClick={toggleAudioPlayback} variant={"outlined" as keyof Object}>
            <div>
              <Image src={playing ? PauseIcon : PlayIcon} alt=""></Image>
            </div>
            <div style={{ fontFamily: mozaicFont.style.fontFamily }}>{playing ? "Parar" : "Reproducir"}</div>
          </SecondaryButton>
        </>
      ) : (
        <PrimaryButton
          id="primary-button"
          onClick={recording ? stopRecording : startRecording}
          variant={(recording ? "pink" : "") as keyof Object}
        >
          {recording ? (
            <>
              <div>
                <Image src={StopIcon} alt=""></Image>
              </div>
              <div style={{ fontFamily: mozaicFont.style.fontFamily }}>Parar</div>
            </>
          ) : (
            <>
              <div>
                <Image src={RecordIcon} alt=""></Image>
              </div>
              <div style={{ fontFamily: mozaicFont.style.fontFamily }}>Grabar</div>
            </>
          )}
        </PrimaryButton>
      )}
    </div>
  );
};

export default Recorder;
