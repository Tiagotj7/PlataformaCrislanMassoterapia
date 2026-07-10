"use server";

import Link from "next/link";
import { getPublicSettings } from "@/app/actions/booking";
import { MapPin, Phone, Clock, Camera, Award, HeartHandshake, Zap, Calendar } from "lucide-react";

export async function Footer() {
  const settings = await getPublicSettings();
  const whatsappUrl = `https://wa.me/${settings?.whatsappNumber}?text=Olá! Gostaria de agendar um atendimento.`;
  const instaUrl = settings?.instagramHandle.startsWith("http") 
    ? settings.instagramHandle 
    : `https://instagram.com/${settings?.instagramHandle?.replace("@", "")}`;

  return (
    <footer className="bg-[#0B0B0B] border-t border-[#1F1F1F] text-slate-400 text-sm mt-24">
      {/* Top Banner / Call to Action */}
      <div className="border-b border-[#1F1F1F] bg-gradient-to-r from-[#003A7A]/40 via-[#006BFF]/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#006BFF] text-white flex items-center justify-center font-bebas text-3xl shadow-xl shadow-[#006BFF]/30">
              CM
            </div>
            <div>
              <h3 className="font-bebas text-3xl text-white tracking-wider">PRONTO PARA ELIMINAR SUAS DORES E RESTAURAR SUA PERFORMANCE?</h3>
              <p className="text-slate-300 mt-1">Agende agora sua sessão online. Sem pagamento antecipado — pague apenas no local do atendimento.</p>
            </div>
          </div>
          <Link
            href="/#agendar"
            className="px-8 py-4 rounded-xl bg-[#006BFF] hover:bg-[#003A7A] text-white font-semibold flex items-center gap-3 shadow-lg shadow-[#006BFF]/30 hover:scale-105 transition-all whitespace-nowrap"
          >
            <Calendar className="w-5 h-5" />
            <span>Garantir Meu Horário</span>
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Col 1: Brand Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bebas text-3xl text-white tracking-widest">CRISLAN <span className="text-[#006BFF]">MASSOTERAPEUTA</span></span>
          </div>
          <p className="leading-relaxed text-slate-400">
            Especialista em recuperação muscular, massagem desportiva, liberação miofascial e ventosaterapia. Atendimentos de alta performance para atletas e clientes exigentes.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-[#1F1F1F] hover:bg-[#006BFF] hover:text-white flex items-center justify-center text-slate-300 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={instaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-[#1F1F1F] hover:bg-[#006BFF] hover:text-white flex items-center justify-center text-slate-300 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Serviços Rápidos */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bebas text-xl text-white tracking-wider border-b border-[#1F1F1F] pb-2">Especializações</h4>
          <ul className="flex flex-col gap-2.5">
            <li><Link href="/#servicos" className="hover:text-[#00A8FF] transition-colors flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-[#006BFF]" /> Massoterapia Desportiva</Link></li>
            <li><Link href="/#servicos" className="hover:text-[#00A8FF] transition-colors flex items-center gap-2"><HeartHandshake className="w-3.5 h-3.5 text-[#006BFF]" /> Liberação Miofascial (IASTM)</Link></li>
            <li><Link href="/#servicos" className="hover:text-[#00A8FF] transition-colors flex items-center gap-2"><Award className="w-3.5 h-3.5 text-[#006BFF]" /> Ventosaterapia Teledirigida</Link></li>
            <li><Link href="/#servicos" className="hover:text-[#00A8FF] transition-colors flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-[#006BFF]" /> Atendimento Domiciliar (Home Care)</Link></li>
          </ul>
        </div>

        {/* Col 3: Expediente */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bebas text-xl text-white tracking-wider border-b border-[#1F1F1F] pb-2">Horário de Atendimento</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#006BFF] mt-1 shrink-0" />
              <div>
                <span className="text-white font-medium">Segunda a Sábado:</span>
                <span className="block text-slate-400">{settings?.businessHourStart} às {settings?.businessHourEnd}</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#00A8FF] mt-1 shrink-0" />
              <div>
                <span className="text-white font-medium">Domingos e Feriados:</span>
                <span className="block text-slate-400">
                  {settings?.sundaysOpen ? "Aberto mediante agendamento" : "Fechado / Exclusivo para competições"}
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Col 4: Localização */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bebas text-xl text-white tracking-wider border-b border-[#1F1F1F] pb-2">Estúdio & Local</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#006BFF] mt-0.5 shrink-0" />
              <span className="text-slate-300 leading-snug">{settings?.address}</span>
            </li>
            <li className="flex items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-lg bg-[#1F1F1F] text-xs font-semibold text-[#00A8FF] uppercase tracking-wider border border-[#003A7A]">
                Estacionamento Conveniado No Local
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1F1F1F] py-8 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Crislan Massoterapeuta. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:text-[#006BFF] transition-colors">Acesso Administrativo</Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">Tecnologia Responsiva Next.js & PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
