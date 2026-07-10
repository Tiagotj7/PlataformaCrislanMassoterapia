"use server";

import { getPublicSettings } from "@/app/actions/booking";
import { Phone } from "lucide-react";

export async function WhatsAppFloatingBtn() {
  const settings = await getPublicSettings();
  const whatsappUrl = `https://wa.me/${settings?.whatsappNumber}?text=Olá! Gostaria de agendar uma sessão ou tirar uma dúvida com Crislan Massoterapeuta.`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Fale direto no WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#006BFF] to-[#00A8FF] text-white shadow-xl hover:scale-110 hover:shadow-2xl hover:shadow-[#006BFF]/50 transition-all duration-300 group"
      >
        <span className="absolute -inset-1 rounded-full bg-[#006BFF] animate-ping opacity-30"></span>
        <Phone className="w-7 h-7 fill-white" />
        
        {/* Tooltip */}
        <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-[#1F1F1F] text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none border border-slate-800">
          Precisa de ajuda? Fale comigo!
        </span>
      </a>
    </div>
  );
}
