import localFont from 'next/font/local';
import Image from 'next/image';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import PauseIcon from '../assets/images/pause_icon.svg';
import PlayIcon from '../assets/images/play_icon.svg';
import RecordAgainIcon from '../assets/images/record_again_icon.svg';
import RecordIcon from '../assets/images/record_icon.svg';
import StopIcon from '../assets/images/stop_icon.svg';
import PrimaryButton from './buttons/PrimaryButton';
import SecondaryButton from './buttons/SecondaryButton';

interface RecorderProps {
  onComplete: (audioBuffer: ArrayBuffer, mimeType: string) => void;
  newRecord?: boolean;
  onRecording: () => void;
  componentRef: React.LegacyRef<HTMLDivElement> | undefined;
  bufferSource: AudioBufferSourceNode | null;
  setBufferSource: React.Dispatch<SetStateAction<AudioBufferSourceNode | null>>;
}

const mozaicFont = localFont({
  src: [
    {
      path: '../assets/fonts/ceibalmozaic-regular-webfont.woff2',
      style: 'normal',
    },
  ],
});

const MAX_RECORDING_DURATION = 1000 * 60 * 5; // max recording time is 5 minutes

const Recorder: React.FC<RecorderProps> = ({
  onComplete,
  newRecord,
  onRecording,
  componentRef,
  bufferSource,
  setBufferSource,
}) => {
  const [recording, setRecording] = useState(false);
  const activeStreamRef = useRef<MediaStream>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const [stopButtonDisabled, setStopButtonDisabled] = useState(false);

  useEffect(() => {
    if (newRecord) {
      setArrayBuffer(null);
    }
  }, [newRecord]);

  const disableStopButtonTemporarily = () => {
    setStopButtonDisabled(true);
    setTimeout(() => {
      setStopButtonDisabled(false);
    }, 10000);
  };

  const stopAudioPlayback = () => {
    if (bufferSource && playing) {
      bufferSource.stop();
      setPlaying(false);
    }
  };

  const stopRecording = () => {
    const buttonElement = document.getElementById(
      'primary-button',
    ) as HTMLElement;
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      activeStreamRef.current
        ?.getAudioTracks()
        .forEach((track: MediaStreamTrack) => {
          track.stop();
          activeStreamRef.current!.removeTrack(track);
        });
      if (buttonElement) {
        buttonElement.style.transform = 'scale(0.75)';
      }
      setTimeout(() => {
        setRecording(false);
      }, 500);
    }
  };

  const startRecording = async () => {
    try {
      stopAudioPlayback();
      onRecording();
      disableStopButtonTemporarily();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      activeStreamRef.current = stream;
      mediaRecorderRef.current = recorder;

      const audioChunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      recorder.onstop = async () => {
        const mimeType = recorder.mimeType.split(';')[0];
        const blob = new Blob(audioChunks, { type: mimeType });
        const buffer = await new Response(blob).arrayBuffer();
        setArrayBuffer(buffer);
        onComplete(buffer, mimeType);
      };

      recorder.start();
      setRecording(true);
      setTimeout(() => {
        if (mediaRecorderRef.current === recorder) {
          stopRecording();
        }
      }, MAX_RECORDING_DURATION);
    } catch (error) {
      console.error('Error starting recording:', error);
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
    } else {
      stopAudioPlayback();
    }
  };

  return (
    <div ref={componentRef} id="recorder" className="row">
      {arrayBuffer && !recording ? (
        <>
          <SecondaryButton
            onClick={startRecording}
            variant={'noFill' as keyof Object}
          >
            <div>
              <Image src={RecordAgainIcon} alt=""></Image>
            </div>
            <div style={{ fontFamily: mozaicFont.style.fontFamily }}>
              Grabar otra vez
            </div>
          </SecondaryButton>
          <SecondaryButton
            onClick={toggleAudioPlayback}
            variant={'outlined' as keyof Object}
          >
            <div>
              <Image src={playing ? PauseIcon : PlayIcon} alt=""></Image>
            </div>
            <div style={{ fontFamily: mozaicFont.style.fontFamily }}>
              {playing ? 'Parar' : 'Reproducir'}
            </div>
          </SecondaryButton>
        </>
      ) : (
        <PrimaryButton
          id="primary-button"
          onClick={recording ? stopRecording : startRecording}
          variant={(recording ? 'pink' : '') as keyof Object}
          disabled={stopButtonDisabled}
        >
          {recording ? (
            <>
              <div>
                <Image src={StopIcon} alt=""></Image>
              </div>
              <div style={{ fontFamily: mozaicFont.style.fontFamily }}>
                Parar
              </div>
            </>
          ) : (
            <>
              <div>
                <Image src={RecordIcon} alt=""></Image>
              </div>
              <div style={{ fontFamily: mozaicFont.style.fontFamily }}>
                Grabar
              </div>
            </>
          )}
        </PrimaryButton>
      )}
    </div>
  );
};

export default Recorder;
