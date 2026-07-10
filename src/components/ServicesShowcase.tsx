"use server";

import Link from "next/link";
import { getServices } from "@/app/actions/booking";
import { Clock, Zap, ArrowRight, Shield, Award, Sparkles, Flame } from "lucide-react";

export async function ServicesShowcase() {
  const servicesList = await getServices();

  return (
    <section id="servicos" className="py-28 bg-[#070707] border-b border-[#1F1F1F] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#006BFF] text-xs font-semibold uppercase tracking-widest block mb-2">Protocolos Premium</span>
          <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-wider">
            SERVIÇOS & <span className="text-[#006BFF]">ESPECIALIDADES</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Selecione o procedimento mais alinhado aos seus objetivos. Todos os procedimentos utilizam cremes e óleos de alta performance de nível profissional.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((serv) => {
            return (
              <div
                key={serv.id}
                className="bg-[#0B0B0B] border border-[#1F1F1F] hover:border-[#006BFF]/60 rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#006BFF]/20 relative"
              >
                {/* Featured glowing badge */}
                {serv.featured && (
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-[#006BFF] to-[#00A8FF] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>Recomendado</span>
                  </div>
                )}

                {/* Top Image */}
                <div className="aspect-[16/10] overflow-hidden relative bg-[#141414]">
                  <img
                    src={serv.image}
                    alt={serv.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent"></div>
                  <span className="absolute bottom-4 left-6 text-xs font-semibold uppercase tracking-wider text-[#00A8FF]">
                    {serv.category}
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-bebas text-3xl text-white tracking-wide group-hover:text-[#006BFF] transition-colors leading-tight">
                      {serv.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {serv.description}
                    </p>
                  </div>

                  {/* Pricing and time indicator */}
                  <div className="pt-6 border-t border-[#1F1F1F] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                      <Clock className="w-4 h-4 text-[#006BFF]" />
                      <span>{serv.durationMinutes} minutos</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Investimento</span>
                      <span className="font-bold text-white text-lg">R$ {Number(serv.price).toFixed(2).replace(".", ",")}</span>
                    </div>
                  </div>

                  {/* Schedule Instant Action button */}
                  <Link
                    href={`/#agendar`}
                    className="w-full py-3.5 rounded-xl bg-[#141414] group-hover:bg-[#006BFF] text-white font-semibold text-xs flex items-center justify-center gap-2 border border-[#1F1F1F] group-hover:border-[#006BFF] shadow-md transition-all"
                  >
                    <span>Agendar Esta Sessão</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom studio recap */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#141414] to-[#0B0B0B] border border-[#1F1F1F] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1 max-w-xl">
            <h4 className="font-bebas text-2xl text-white tracking-wider flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-[#00A8FF]" />
              <span>Precisa de um Atendimento Emergencial?</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Disponibilizamos horários especiais em dias de evento esportivo ou contraturas agudas. Fale diretamente pelo WhatsApp.
            </p>
          </div>
          <Link
            href="/#agendar"
            className="px-8 py-3.5 rounded-xl bg-[#006BFF] hover:bg-[#003A7A] text-white font-semibold text-xs whitespace-nowrap shadow-lg shadow-[#006BFF]/20"
          >
            Consultar Disponibilidade
          </Link>
        </div>

      </div>
    </section>
  );
}
