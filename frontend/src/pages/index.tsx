import React, { useState, useRef } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Recorder from "@/components/Recorder";
import Image from "next/image";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SendIcon from "../assets/images/send_icon.svg";
import TextContainer from "@/components/containers/TextContainer";

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
  const [mimeType, setMimetype] = useState<string>("");
  const [newRecord, setNewRecord] = useState(false);

  const ref = useRef(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  async function uploadFile(arrayBuffer: ArrayBuffer, mimeType: string) {
    const fileExtension = getFileExtension(mimeType);
    const file = new File([arrayBuffer], `audio-file.${fileExtension}`, {
      type: mimeType,
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/recordings/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const fileUrl = await response.text();
        console.log("File uploaded successfully:", fileUrl);
      } else {
        console.error("Error uploading file:", response.status);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
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
    if (buffer) {
      uploadFile(buffer, mimeType).then(() => {
        alert("Archivo subido");
      });
      const recorder = divRef.current;
      if (recorder) {
        recorder.style.animation = "vanish 0.6s ease-in-out";
      }
      if (ref.current) {
        const sendButton = ref.current as HTMLElement;
        sendButton.style.animation = "vanish 0.6s ease-in-out";
      }
      setTimeout(() => {
        setSendActive(false);
        setNewRecord(true);
        if (recorder) {
          recorder.style.animation = "appear 0.6s ease-in-out";
        }
      }, 500);
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
          <TextContainer />
          <Recorder
            componentRef={divRef}
            onComplete={onComplete}
            newRecord={newRecord}
            onRecording={onRecording}
          ></Recorder>
          {sendActive && (
            <PrimaryButton buttonRef={ref} onClick={onSend} variant={"large" as keyof Object}>
              <div>
                <Image src={SendIcon} alt=""></Image>
              </div>
              <div style={{ fontFamily: mozaicFont.style.fontFamily }}>Enviar</div>
            </PrimaryButton>
          )}
        </div>
      </main>
    </>
  );
}
