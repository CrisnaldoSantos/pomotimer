import type { MetadataRoute } from "next";

// Aumente ao trocar os arquivos de /public/icons: muda a URL e força o navegador a baixar de novo
const ICON_VERSION = "2";
const icon = (file: string) => `/icons/${file}?v=${ICON_VERSION}`;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "pomotimer",
    short_name: "pomotimer",
    description: "Pomodoro para devs: timer, ciclos e configurações.",
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0d1117",
    theme_color: "#0d1117",
    icons: [
      { src: icon("icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: icon("icon-512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: icon("icon-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Ciclos", url: "/ciclos", icons: [{ src: icon("icon-192.png"), sizes: "192x192" }] },
      { name: "Configurações", url: "/configuracoes", icons: [{ src: icon("icon-192.png"), sizes: "192x192" }] },
    ],
  };
}
