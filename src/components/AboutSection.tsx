"use server";

import Link from "next/link";
import { Award, CheckCircle2, Zap, UserCheck, HeartPulse, ShieldCheck, Dumbbell, Move } from "lucide-react";

export async function AboutSection() {
  return (
    <section id="sobre" className="py-28 bg-[#0B0B0B] border-b border-[#1F1F1F] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Visual Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden border border-[#1F1F1F] shadow-xl aspect-[4/5] relative">
                <img
                  src="/images/MassoTerapeutica.png"
                  alt="Técnica de Liberação Miofascial"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 rounded-3xl bg-[#141414] border border-[#1F1F1F] space-y-2">
                <Dumbbell className="w-8 h-8 text-[#006BFF]" />
                <h4 className="font-bebas text-2xl text-white">Especialista em Atletas</h4>
                <p className="text-xs text-slate-400">Maratonistas, triatletas, lutadores e praticantes de LPO/CrossFit.</p>
              </div>
            </div>

            <div className="space-y-4 pt-12">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#006BFF] to-[#003A7A] text-white space-y-2 shadow-lg shadow-[#006BFF]/20">
                <span className="font-bebas text-5xl tracking-wider block">100%</span>
                <h4 className="font-bebas text-2xl">Personalizado</h4>
                <p className="text-xs text-white/80">Cada sessão é única, ajustada à sua fadiga e queixa pontual.</p>
              </div>
              <div className="rounded-3xl overflow-hidden border border-[#1F1F1F] shadow-xl aspect-[4/5] relative">
                <img
                  src="https://images.pexels.com/photos/37719558/pexels-photo-37719558.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
                  alt="Ventosaterapia Profissional"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[#00A8FF] text-xs font-semibold uppercase tracking-widest block mb-2">Trajetória e Propósito</span>
              <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-white tracking-wider">
                QUEM É CRISLAN <br />
                <span className="text-[#006BFF]">MASSOTERAPEUTA?</span>
              </h2>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Com formação de excelência em Massoterapia Clínica e Desportiva, Crislan atua transformando a qualidade de vida de clientes exigentes em São Paulo. Seu método alia profundo conhecimento anatômico às mais modernas ferramentas de reabilitação tecidual.
            </p>

            <p className="text-slate-400 text-sm leading-relaxed">
              Diferente de spas convencionais, o foco de Crislan é <strong>reparação ativa e resultado real</strong>. Seja na eliminação de nós de tensão gerados pela rotina corporativa, ou na preparação e recuperação de atletas para competições de alto nível.
            </p>

            {/* Specialties Key Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#141414] border border-[#1F1F1F] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#006BFF]/10 text-[#006BFF] flex items-center justify-center shrink-0 mt-0.5">
                  <Move className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bebas text-xl text-white">IASTM Avançado</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Liberação instrumental precisa para fáscia e tendões.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-[#1F1F1F] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#006BFF]/10 text-[#006BFF] flex items-center justify-center shrink-0 mt-0.5">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bebas text-xl text-white">Home Care & Estúdio</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Atendimento em estúdio moderno ou no conforto de sua casa com maca.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-4">
              <Link
                href="/#agendar"
                className="px-8 py-4 rounded-xl bg-[#006BFF] hover:bg-[#003A7A] text-white font-semibold text-sm shadow-lg shadow-[#006BFF]/25 hover:-translate-y-0.5 transition-all"
              >
                Agendar Uma Avaliação
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
