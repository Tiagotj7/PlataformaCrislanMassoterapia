"use server";

import { getPublicSettings } from "@/app/actions/booking";
import { MapPin, Phone, Clock, Navigation, Sparkles, HelpCircle, ChevronDown } from "lucide-react";

export async function StudioMapSection() {
  const settings = await getPublicSettings();

  const faqList = [
    {
      q: "Como funciona a política de pagamentos?",
      a: "Não há exigência de cartão de crédito no site. O agendamento garante sua vaga e você realiza o acerto financeiro (Pix ou Dinheiro) presencialmente com o massoterapeuta após o término da sessão."
    },
    {
      q: "O que está incluído no Atendimento Domiciliar (Home Care)?",
      a: "Crislan leva todo o equipamento necessário até sua residência, condomínio ou hotel: maca profissional ergonômica, toalhas higienizadas, óleos terapêuticos e ventosas. O espaço precisa apenas comportar a abertura da maca."
    },
    {
      q: "Com qual antecedência devo agendar minha sessão?",
      a: "Recomendamos agendar com pelo menos 24 a 48 horas de antecedência, pois a agenda costuma ser concorrida em semanas de eventos esportivos em São Paulo."
    },
    {
      q: "Posso remarcar ou cancelar meu horário?",
      a: "Sim, pedimos apenas a gentileza de avisar com no mínimo 4 horas de antecedência diretamente pelo WhatsApp para que possamos disponibilizar o horário a outro paciente."
    }
  ];

  return (
    <section id="localizacao" className="py-28 bg-[#0B0B0B] border-b border-[#1F1F1F] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Split Section: FAQ and Google Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* FAQ Column */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-[#00A8FF] text-xs font-semibold uppercase tracking-widest block mb-2">Esclareça Suas Dúvidas</span>
              <h2 className="font-bebas text-5xl text-white tracking-wider">
                PERGUNTAS <span className="text-[#006BFF]">FREQUENTES</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">
                Tudo o que você precisa saber sobre as sessões, preparativos e locais de atendimento.
              </p>
            </div>

            <div className="space-y-4">
              {faqList.map((item, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-[#141414] border border-[#1F1F1F] space-y-3">
                  <h4 className="font-bebas text-2xl text-white flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#006BFF] shrink-0" />
                    <span>{item.q}</span>
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed pl-8">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Google Map Column */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-[#00A8FF] text-xs font-semibold uppercase tracking-widest block mb-2">Como Chegar</span>
              <h2 className="font-bebas text-5xl text-white tracking-wider">
                LOCALIZAÇÃO DO <span className="text-[#006BFF]">ESTÚDIO</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#006BFF] shrink-0" />
                <span>{settings?.address}</span>
              </p>
            </div>

            {/* Google Map Container */}
            <div className="rounded-3xl overflow-hidden border border-[#1F1F1F] shadow-2xl aspect-[4/3] relative bg-[#141414]">
              <iframe
                title="Google Maps Estúdio Crislan"
                src={settings?.googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter grayscale contrast-125 opacity-90 hover:filter-none transition-all duration-500"
              ></iframe>
            </div>

            {/* Practical info banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#141414] border border-[#1F1F1F] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#006BFF]/10 text-[#006BFF] flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bebas text-xl text-white block">Pontualidade Britânica</span>
                  <span className="text-slate-400 text-xs">Chegue 10 min antes de seu horário</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#141414] border border-[#1F1F1F] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00A8FF]/10 text-[#00A8FF] flex items-center justify-center shrink-0">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bebas text-xl text-white block">Fácil Acesso</span>
                  <span className="text-slate-400 text-xs">Próximo aos shoppings e avenidas</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
