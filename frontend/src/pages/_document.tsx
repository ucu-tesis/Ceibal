import MainHeader from "@/components/headers/MainHeader";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es-UY">
      <Head />
      <body>
        <MainHeader></MainHeader>
        <hr></hr>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
