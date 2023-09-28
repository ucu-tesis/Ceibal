import React, { useState, useRef } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Recorder from "@/components/Recorder";
import Image from "next/image";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import SendIcon from "../assets/images/send_icon.svg";
import TextContainer from "@/components/containers/TextContainer";
import Spinner from "@/components/spinners/Spinner";
import ModalDialog from "@/components/modals/ModalDialog";
import ProgressBar from "@/components/progress/ProgressBar";
import useFileUpload from "../hooks/students/useFileUpload";

const inter = Inter({ subsets: ["latin"] });

const mozaicFont = localFont({
  src: [
    {
      path: "../assets/fonts/ceibalmozaic-regular-webfont.woff2",
      style: "normal",
    },
  ],
});

export default function Home() {
  const [sendActive, setSendActive] = useState(false);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [bufferSource, setBufferSource] =
    useState<AudioBufferSourceNode | null>(null);
  const [mimeType, setMimetype] = useState<string>("");
  const [newRecord, setNewRecord] = useState(false);

  const [errorModal, setErrorModal] = useState(false);
  const [openModal, setOpen] = useState(false);

  const [score, setScore] = useState<string | null>(null);
  const [silence, setSilence] = useState<string | null>(null);
  const [repetitions, setRepetitions] = useState<string | null>(null);
  const [speed, setSpeed] = useState<string | null>(null);

  const ref = useRef(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const errorModalRef = useRef<HTMLDivElement | null>(null);

  // Usar data que devuelve el hook
  const onSuccess = async (data: Response) => {
    setOpen(true);
    const response = data as any;
    const {
      data: {
        indicadores: {
          cantidad_de_repeticiones,
          cantidad_de_silencios,
          puntaje,
          velocidad_palabras,
        },
      },
    } = response;
    setScore(puntaje + "");
    setSilence(cantidad_de_silencios + "");
    setRepetitions(cantidad_de_repeticiones + "");
    setSpeed(velocidad_palabras + "");
  };

  const onError = (data: any) => {
    console.error("Error uploading file:", data?.status);
    console.log(`error: ${JSON.stringify(error)}`);
    setErrorModal(true);
  };

  const { mutate, isLoading, error } = useFileUpload(onSuccess, onError);

  async function uploadFile(arrayBuffer: ArrayBuffer, mimeType: string) {
    const fileExtension = getFileExtension(mimeType);
    const file = new File([arrayBuffer], `audio-file.${fileExtension}`, {
      type: mimeType,
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      mutate(formData);
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorModal(true);
    }
  }

  function getFileExtension(mimeType: string) {
    const mimeToExtensionMap: { [key: string]: string } = {
      "audio/mpeg": "mp3",
      "audio/mp4": "m4a",
      "audio/ogg": "ogg",
      "audio/webm": "webm",
      "audio/wav": "wav",
    };
    return mimeToExtensionMap[mimeType] || "unknown";
  }

  const onSend = () => {
    bufferSource?.stop();
    if (buffer) {
      uploadFile(buffer, mimeType).then(() => {
        setSendActive(false);
        setNewRecord(true);
        if (recorder) {
          recorder.style.animation = "appear 0.6s ease-in-out";
        }
      });
      const recorder = divRef.current;
      if (recorder) {
        recorder.style.animation = "vanish 0.6s ease-in-out";
      }
      if (ref.current) {
        const sendButton = ref.current as HTMLElement;
        sendButton.style.animation = "vanish 0.6s ease-in-out";
      }
    }
  };

  const onComplete = (buffer: ArrayBuffer, mimeType: string) => {
    setBuffer(buffer);
    setMimetype(mimeType);
    setSendActive(true);
  };

  const onRecording = () => {
    setSendActive(false);
    setNewRecord(false);
  };

  const closeModal = () => {
    const modal = modalRef.current;
    if (modal) {
      modal.style.transform = "scale(0.5)";
    }
    setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  const closeErrorModal = () => {
    const modal = errorModalRef.current;
    if (modal) {
      modal.style.transform = "scale(0.5)";
    }
    setTimeout(() => {
      setErrorModal(false);
    }, 300);
  };

  return (
    <>
      <Head>
        <title>Grabar - Ceibal</title>
        <meta name="description" content="Grabar una lectura" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container col">
          {openModal && (
            <ModalDialog
              componentRef={modalRef}
              title="Resultado De Evaluacion"
            >
              <div className="progress col">
                <ProgressBar value={score ?? "50"}></ProgressBar>
                <span>Cantidad de pausas: {silence}</span>
                <span>Cantidad de repeticiones: {repetitions}</span>
                <span>Velocidad de lectura: {speed} palabras/minuto</span>
                <SecondaryButton
                  onClick={closeModal}
                  variant={"blueFill" as keyof Object}
                >
                  Aceptar
                </SecondaryButton>
              </div>
            </ModalDialog>
          )}
          {errorModal && (
            <ModalDialog componentRef={errorModalRef} title="Ups">
              <span>
                Lo sentimos, tu lectura no se ha podido enviar. Inténtalo de
                nuevo más tarde o pide ayuda a un adulto.
              </span>
              <SecondaryButton
                onClick={closeErrorModal}
                variant={"redFill" as keyof Object}
              >
                Cerrar
              </SecondaryButton>
            </ModalDialog>
          )}
          <TextContainer />
          {!isLoading ? (
            <>
              <Recorder
                componentRef={divRef}
                onComplete={onComplete}
                newRecord={newRecord}
                onRecording={onRecording}
                bufferSource={bufferSource}
                setBufferSource={setBufferSource}
              ></Recorder>
              {sendActive && (
                <PrimaryButton
                  buttonRef={ref}
                  onClick={onSend}
                  variant={"large" as keyof Object}
                >
                  <div>
                    <Image src={SendIcon} alt=""></Image>
                  </div>
                  <div style={{ fontFamily: mozaicFont.style.fontFamily }}>
                    Enviar
                  </div>
                </PrimaryButton>
              )}
            </>
          ) : (
            <Spinner />
          )}
        </div>
      </main>
    </>
  );
}
