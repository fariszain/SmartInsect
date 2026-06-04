import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LensArthropoda — Identifikasi Serangga Cerdas",
  description:
    "Sistem identifikasi spesies serangga otomatis berbasis Deep Learning (EfficientNet-B3) dengan wawasan AI Gemini 2.5 Flash. Final Project Pembelajaran Mesin 2026.",
  keywords: ["serangga", "insect", "deep learning", "pytorch", "machine learning", "gemini"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
