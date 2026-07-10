"use server";

import Link from "next/link";
import { Calendar, Phone, ShieldCheck, Menu } from "lucide-react";
import { getPublicSettings } from "@/app/actions/booking";

export async function Navbar() {
  const settings = await getPublicSettings();
  const whatsappUrl = `https://wa.me/${settings?.whatsappNumber}?text=Olá! Gostaria de tirar uma dúvida sobre os atendimentos de massoterapia.`;

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#006BFF] to-[#003A7A] flex items-center justify-center text-white font-bebas text-2xl tracking-wider shadow-lg shadow-[#006BFF]/20 group-hover:scale-105 transition-transform">
            CM
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-2xl tracking-widest text-white leading-none">CRISLAN</span>
            <span className="text-xs uppercase tracking-[0.25em] text-[#00A8FF] font-medium mt-0.5">MASSOTERAPEUTA</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/#sobre" className="hover:text-white transition-colors">Sobre</Link>
          <Link href="/#servicos" className="hover:text-white transition-colors">Serviços</Link>
          <Link href="/#beneficios" className="hover:text-white transition-colors">Benefícios</Link>
          <Link href="/#depoimentos" className="hover:text-white transition-colors">Depoimentos</Link>
          <Link href="/#localizacao" className="hover:text-white transition-colors">Estúdio</Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-[#1F1F1F] text-slate-300 hover:text-white hover:bg-[#1F1F1F] transition-all"
          >
            <Phone className="w-4 h-4 text-[#00A8FF]" />
            <span>WhatsApp</span>
          </a>

          <Link
            href="/#agendar"
            className="flex items-center gap-2 bg-[#006BFF] hover:bg-[#003A7A] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-[#006BFF]/25 hover:shadow-xl hover:shadow-[#006BFF]/40 hover:-translate-y-0.5 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Sessão</span>
          </Link>

          {/* Admin link helper */}
          <Link
            href="/admin"
            title="Acessar Painel do Massoterapeuta"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1F1F1F] hover:bg-[#006BFF] text-slate-400 hover:text-white transition-all ml-1"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
