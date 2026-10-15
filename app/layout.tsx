import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "./components/nav";
import { PwaRegister } from "./components/pwa-register";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "pomotimer",
  description: "Pomodoro para devs",
  appleWebApp: {
    capable: true,
    title: "pomotimer",
    statusBarStyle: "black",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
