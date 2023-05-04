import Head from "next/head";
import { Inter } from "next/font/google";
import Recorder from "@/components/Recorder";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  async function uploadFile(arrayBuffer: ArrayBuffer, mimeType: string) {
    const fileExtension = getFileExtension(mimeType);
    const file = new File([arrayBuffer], `audio-file.${fileExtension}`, {
      type: mimeType,
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/recordings/upload",
        {
          method: "POST",
          body: formData,
        }
      );

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

  return (
    <>
      <Head>
        <title>Grabar - Ceibal</title>
        <meta name="description" content="Grabar una lectura" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Recorder
          onComplete={(buffer, mimeType) =>
            uploadFile(buffer, mimeType).then(() => alert("Archivo subido"))
          }
        ></Recorder>
      </main>
    </>
  );
}
