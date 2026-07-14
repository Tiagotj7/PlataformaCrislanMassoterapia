import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Poppins, Bebas_Neue } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "Crislan Massoterapeuta — Recuperação Muscular & Alta Performance",
  description: "Sistema profissional de agendamento de massoterapia. Especialista em atletas, liberação miofascial, ventosaterapia e massagem desportiva em São Paulo.",
  keywords: ["massoterapia", "massagem desportiva", "liberação miofascial", "ventosaterapia", "massagista esportivo", "recuperação muscular", "atendimento domiciliar"],
  authors: [{ name: "Crislan Massoterapeuta" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Crislan Massoterapeuta — Recuperação Muscular & Alta Performance",
    description: "Agende sua sessão de massoterapia desportiva e liberação miofascial online em menos de 60 segundos.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${bebasNeue.variable} scroll-smooth`}>
      <body className="bg-[#0B0B0B] text-slate-100 font-sans antialiased selection:bg-[#006BFF] selection:text-white flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
