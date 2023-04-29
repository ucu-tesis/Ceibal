import Head from "next/head";
import { Inter } from "next/font/google";
import Recorder from "@/components/Recorder";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
          onComplete={(buffer) =>
            console.log("Recording completed, send to backend", buffer)
          }
        ></Recorder>
      </main>
    </>
  );
}
