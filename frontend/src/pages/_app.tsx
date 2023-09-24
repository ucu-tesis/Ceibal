import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import MainHeader from "@/components/headers/MainHeader";
import { UserProvider } from "@/providers/UserContext";
import { useRouter } from "next/router";

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

const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader =
    router.pathname.startsWith("/alumno") ||
    router.pathname.startsWith("/maestro");
  return (
    <UserProvider>
      <QueryClientProvider client={client}>
        <div>
          <style jsx global>{`
            body {
              font-family: ${mozaicFont.style.fontFamily} !important;
            }
          `}</style>
          {showHeader && <MainHeader />}
          {showHeader && <hr />}
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </UserProvider>
  );
}