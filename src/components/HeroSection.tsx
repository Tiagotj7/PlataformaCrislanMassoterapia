"use server";

import Link from "next/link";
import { getPublicSettings } from "@/app/actions/booking";
import { ArrowRight, Shield, Award, Zap, Star, Phone, Sparkles } from "lucide-react";

export async function HeroSection() {
  const settings = await getPublicSettings();
  const whatsappUrl = `https://wa.me/${settings?.whatsappNumber}?text=Olá Crislan! Gostaria de agendar uma sessão de massoterapia.`;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#1F1F1F] pt-8 pb-20">
      {/* Background Graphic elements for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0B0B0B]/80 to-[#0B0B0B] z-10 pointer-events-none"></div>
      
      {/* Glowing atmospheric orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#006BFF]/20 to-[#00A8FF]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#003A7A]/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Aesthetic grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F1F1F_1px,transparent_1px),linear-gradient(to_bottom,#1F1F1F_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Top Elite Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#141414] border border-[#1F1F1F] shadow-lg">
              <Sparkles className="w-4 h-4 text-[#00A8FF] animate-spin" />
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                Massoterapia Desportiva & Clínica Premium
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-bebas text-6xl sm:text-7xl lg:text-8xl tracking-wider text-white leading-[0.95]">
              RECUPERAÇÃO MUSCULAR <br />
              <span className="bg-gradient-to-r from-[#006BFF] via-[#00A8FF] to-white bg-clip-text text-transparent">
                & ALTA PERFORMANCE
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              Elimine fadiga crônica, previna lesões e conquiste seu máximo rendimento físico. Atendimento especializado para atletas, praticantes de atividade física e executivos em São Paulo.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
              <Link
                href="/#agendar"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#006BFF] hover:bg-[#003A7A] text-white font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-[#006BFF]/30 hover:shadow-2xl hover:shadow-[#006BFF]/50 hover:-translate-y-1 transition-all"
              >
                <span>Agendar Minha Sessão</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#141414] hover:bg-[#1F1F1F] text-slate-200 font-semibold text-base flex items-center justify-center gap-2.5 border border-[#1F1F1F] hover:border-[#006BFF] transition-all"
              >
                <Phone className="w-5 h-5 text-[#00A8FF]" />
                <span>Tirar Dúvidas no WhatsApp</span>
              </a>
            </div>

            {/* Bottom Pillar Feature Ticks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-[#1F1F1F] w-full max-w-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#006BFF]/10 text-[#006BFF] flex items-center justify-center font-bold text-sm shrink-0">✓</div>
                <span className="text-xs text-slate-300 font-medium">Estúdio ou Domiciliar</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#006BFF]/10 text-[#006BFF] flex items-center justify-center font-bold text-sm shrink-0">✓</div>
                <span className="text-xs text-slate-300 font-medium">Liberação Miofascial</span>
              </div>
              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-lg bg-[#006BFF]/10 text-[#006BFF] flex items-center justify-center font-bold text-sm shrink-0">✓</div>
                <span className="text-xs text-slate-300 font-medium">Sem Pagamento Antecipado</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Main Photo Card */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-[#1F1F1F] shadow-2xl group">
              <img
                src="src/assets/image/logocrislanmassagem.jpeg"
                alt="Crislan Massoterapeuta em Atendimento"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80"></div>
              
              {/* Overlay Therapist identification */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-[#0B0B0B]/80 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#00A8FF] uppercase tracking-wider font-semibold block">Especialista Profissional</span>
                  <h3 className="font-bebas text-2xl text-white tracking-wide mt-0.5">CRISLAN MASSOTERAPEUTA</h3>
                </div>
                <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-xs font-bold">5.0</span>
                </div>
              </div>
            </div>

            {/* Floating Floating Info Cards */}
            <div className="absolute -top-6 -left-6 hidden sm:flex items-center gap-3 p-4 rounded-2xl bg-[#141414] border border-[#1F1F1F] shadow-xl animate-bounce">
              <Award className="w-8 h-8 text-[#006BFF]" />
              <div>
                <span className="block font-bebas text-xl text-white">100% Focado em Resultados</span>
                <span className="text-xs text-slate-400">Recuperação e Alívio Imediato</span>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 p-4 rounded-2xl bg-[#141414] border border-[#1F1F1F] shadow-xl">
              <Zap className="w-8 h-8 text-[#00A8FF]" />
              <div>
                <span className="block font-bebas text-xl text-white">IASTM & Ventosaterapia</span>
                <span className="text-xs text-slate-400">Tecnologia Terapêutica Aplicada</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
