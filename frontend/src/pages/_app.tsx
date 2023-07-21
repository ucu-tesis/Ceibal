import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";

const mozaicFont = localFont({
  src: [
    {
      path: "../assets/fonts/ceibalmozaic-regular-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/ceibalmozaic-italica-webfont.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/ceibalmozaic-bold-webfont.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/ceibalmozaic-bolditalica-webfont.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <style jsx global>{`
        body {
          font-family: ${mozaicFont.style.fontFamily} !important;
        }
      `}</style>
      <Component {...pageProps} />
    </div>
  );
}
