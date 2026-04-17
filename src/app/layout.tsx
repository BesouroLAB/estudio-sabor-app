import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Estúdio & Sabor | Sua Agência de Delivery no Bolso",
  description:
    "Transforme fotos de celular em imagens, capas e textos que vendem no iFood em 30 segundos. Food Styling com IA + Copywriting automático.",
  keywords: [
    "fotografia gastronomica",
    "fotos ifood",
    "capa ifood",
    "imagens cardápio",
    "food styling ia",
    "marketing delivery",
  ],
  openGraph: {
    title: "Estúdio & Sabor | Marketing 1-Click para Delivery",
    description: "Transforme fotos de celular em pacotes de marketing profissional para iFood em 30 segundos.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-bg-base text-text-primary font-body">
        {children}
      </body>
    </html>
  );
}
