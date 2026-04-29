import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Estúdio & Sabor | Fotos Profissionais para iFood com IA",
  description:
    "Transforme fotos de celular em imagens profissionais para cardápio iFood. IA gastronômica com entrega instantânea. Teste grátis.",
  keywords: [
    "fotos para ifood",
    "tamanho capa ifood",
    "imagens cardápio ifood tamanho",
    "foto profissional delivery",
    "ia fotografia gastronomica",
    "melhorar foto comida ia",
  ],
  openGraph: {
    title: "Estúdio & Sabor | Fotos Profissionais para iFood com IA",
    description: "Transforme fotos de celular em imagens profissionais para cardápio iFood. Teste grátis com 30 créditos.",
    type: "website",
    locale: "pt_BR",
  },
  icons: {
    icon: "https://res.cloudinary.com/do8gdtozt/image/upload/v1761782366/pimenta_sem__fundo_qur83u.png",
    apple: "https://res.cloudinary.com/do8gdtozt/image/upload/v1761782366/pimenta_sem__fundo_qur83u.png",
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
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="https://res.cloudinary.com/do8gdtozt/image/upload/v1761782366/pimenta_sem__fundo_qur83u.png" sizes="any" />
      </head>
      <body className="min-h-dvh flex flex-col bg-stone-50 text-stone-900 font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
