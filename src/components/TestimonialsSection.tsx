"use server";

import { getPublicTestimonials, getPublicGallery } from "@/app/actions/booking";
import { Star, Quote, Award, Sparkles, User, Dumbbell, Move } from "lucide-react";

export async function TestimonialsSection() {
  const testimonialsList = await getPublicTestimonials();
  const galleryList = await getPublicGallery();

  return (
    <section id="depoimentos" className="py-28 bg-[#070707] border-b border-[#1F1F1F] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Testimonials Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#006BFF] text-xs font-semibold uppercase tracking-widest block mb-2">Histórias de Sucesso</span>
          <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-wider">
            DEPOIMENTOS DE <span className="text-[#006BFF]">PACIENTES & ATLETAS</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Veja como Crislan tem otimizado a performance esportiva e eliminado a dor crônica de quem confia no seu trabalho.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsList.map((test) => {
            return (
              <div
                key={test.id}
                className="p-8 rounded-3xl bg-[#0B0B0B] border border-[#1F1F1F] hover:border-[#003A7A] transition-all duration-300 space-y-6 flex flex-col justify-between shadow-2xl relative group"
              >
                <div className="absolute top-6 right-6 text-slate-800 group-hover:text-[#006BFF]/20 transition-colors pointer-events-none">
                  <Quote className="w-12 h-12" />
                </div>

                <div className="space-y-4 relative z-10">
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                    "{test.content}"
                  </p>
                </div>

                {/* Client Info */}
                <div className="pt-6 border-t border-slate-800 flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#1F1F1F] border border-slate-700 flex items-center justify-center text-[#00A8FF] shrink-0 font-bebas text-xl">
                    {test.clientName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bebas text-xl text-white tracking-wide">{test.clientName}</h4>
                    <span className="text-[11px] font-medium text-[#006BFF] uppercase tracking-wider block">{test.roleOrSport}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gallery Showcase Header */}
        {galleryList.length > 0 && (
          <div className="mt-32 pt-16 border-t border-[#1F1F1F]">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#00A8FF] text-xs font-semibold uppercase tracking-widest block mb-2">Por Dentro Das Sessões</span>
              <h3 className="font-bebas text-4xl sm:text-5xl text-white tracking-wider">
                GALERIA DE <span className="text-[#006BFF]">ATENDIMENTOS</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryList.map((item) => (
                <div key={item.id} className="group relative rounded-3xl overflow-hidden border border-[#1F1F1F] aspect-[4/3] bg-[#141414] shadow-xl">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-[#0B0B0B]/80 backdrop-blur-sm border border-slate-800">
                    <span className="text-[10px] text-[#00A8FF] uppercase font-bold block">{item.category}</span>
                    <span className="font-bebas text-lg text-white block truncate mt-0.5">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
