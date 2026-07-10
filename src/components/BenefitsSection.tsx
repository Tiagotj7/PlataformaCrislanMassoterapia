"use server";

import Link from "next/link";
import { Zap, ShieldCheck, Home, Activity, Flame, HeartHandshake, Check, Award } from "lucide-react";

export async function BenefitsSection() {
  const benefitsList = [
    {
      icon: Flame,
      title: "Especialista em Atletas & High Performance",
      description: "Preparação pré-competição e alívio pós-prova. Libere ácido lático aceleradamente e reduza a rigidez muscular gerada por maratonas e treinos de LPO/CrossFit."
    },
    {
      icon: Home,
      title: "Atendimento Domiciliar (Home Care Premium)",
      description: "Crislan transporta o estúdio até a sua residência ou hotel. Leva maca profissional dobrável ergonômica, lençóis esterilizados e óleos essenciais de altíssimo padrão."
    },
    {
      icon: Activity,
      title: "Resultados Terapêuticos Imediatos",
      description: "Técnicas instrumentais (IASTM) e soltura manual profunda desfazem pontos de gatilho crônicos na primeira sessão, devolvendo sua amplitude de movimento e alívio das dores."
    },
    {
      icon: ShieldCheck,
      title: "Sem Pagamento Antecipado",
      description: "Você faz seu agendamento em tempo real com garantia de vaga e realiza o pagamento de maneira 100% segura apenas presencialmente após receber seu atendimento."
    }
  ];

  return (
    <section id="beneficios" className="py-28 bg-[#0B0B0B] border-b border-[#1F1F1F] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#00A8FF] text-xs font-semibold uppercase tracking-widest block mb-2">Por Que Escolher Crislan?</span>
          <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-wider">
            BENEFÍCIOS EXCLUSIVOS DO <span className="text-[#006BFF]">MÉTODO</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Um ecossistema completo pensado na eficiência, pontualidade e acolhimento do paciente exigente em cada momento da sessão.
          </p>
        </div>

        {/* Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefitsList.map((b, idx) => {
            const IconComponent = b.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#141414] border border-[#1F1F1F] hover:border-[#006BFF] transition-all duration-300 hover:-translate-y-2 group space-y-6 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[#0B0B0B] border border-slate-800 flex items-center justify-center text-[#006BFF] group-hover:bg-[#006BFF] group-hover:text-white transition-colors duration-300 shadow-md">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="font-bebas text-2xl text-white tracking-wide mt-6 leading-snug group-hover:text-[#00A8FF] transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-[#006BFF]" />
                  <span>Excelência Comprovada</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Big CTA banner inside benefits */}
        <div className="mt-20 text-center">
          <Link
            href="/#agendar"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#006BFF] to-[#003A7A] hover:from-[#003A7A] hover:to-[#006BFF] text-white font-bold text-sm px-10 py-4 rounded-xl shadow-xl hover:scale-105 transition-all"
          >
            <Award className="w-5 h-5" />
            <span>Experimente Seus Resultados na Prática</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
