"use client";

import { useState, useEffect } from "react";
import { getAvailableTimeSlots, createAppointment } from "@/app/actions/booking";
import { Calendar, Clock, MapPin, Phone, User, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, ShieldCheck, HelpCircle, FileText } from "lucide-react";

interface ServiceItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  durationMinutes: number;
  price: string;
  image: string;
  category: string;
  featured: boolean;
}

interface BookingWizardProps {
  initialServices: ServiceItem[];
  settings: any;
  preSelectedServiceId?: number;
}

export function BookingWizard({ initialServices, settings, preSelectedServiceId }: BookingWizardProps) {
  // Wizard steps: 1 = Serviço | 2 = Data & Hora | 3 = Meus Dados | 4 = Sucesso
  const [step, setStep] = useState<number>(1);
  
  // Booking Data
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [careType, setCareType] = useState<string>("studio"); // 'studio' | 'domiciliar'
  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [observations, setObservations] = useState<string>("");

  // UI state
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [slotReason, setSlotReason] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successData, setSuccessData] = useState<any>(null);

  // Quick 14 days generator
  const [datesList, setDatesList] = useState<{ dateStr: string; label: string; dayName: string; isSunday: boolean }[]>([]);

  useEffect(() => {
    // Generate next 14 accessible days
    const days: { dateStr: string; label: string; dayName: string; isSunday: boolean }[] = [];
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const dayNum = d.getDate();
      const monthNum = d.getMonth() + 1;
      const label = `${String(dayNum).padStart(2, "0")}/${String(monthNum).padStart(2, "0")}`;
      const dayOfWeek = d.getDay();
      
      days.push({
        dateStr,
        label,
        dayName: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : dayNames[dayOfWeek],
        isSunday: dayOfWeek === 0
      });
    }
    setDatesList(days);

    // Pre-select today or tomorrow
    const firstValidDay = days.find(d => settings?.sundaysOpen || !d.isSunday);
    if (firstValidDay) {
      setSelectedDate(firstValidDay.dateStr);
    }

    // If preSelectedServiceId is provided
    if (preSelectedServiceId) {
      const found = initialServices.find(s => s.id === preSelectedServiceId);
      if (found) {
        setSelectedService(found);
        setStep(2); // Jump directly to date/time step
      }
    } else if (initialServices.length > 0) {
      setSelectedService(initialServices[0]);
    }
  }, [initialServices, settings, preSelectedServiceId]);

  // Fetch slots whenever selectedDate or selectedService changes
  useEffect(() => {
    async function loadSlots() {
      if (!selectedDate || !selectedService) return;
      setLoadingSlots(true);
      setErrorMsg("");
      setSelectedTime(""); // reset time
      
      const res = await getAvailableTimeSlots(selectedDate, selectedService.durationMinutes);
      if (res.available) {
        setAvailableSlots(res.slots);
        setSlotReason("");
      } else {
        setAvailableSlots([]);
        setSlotReason(res.reason || "Nenhum horário disponível");
      }
      setLoadingSlots(false);
    }
    loadSlots();
  }, [selectedDate, selectedService]);

  const handleServiceSelect = (serv: ServiceItem) => {
    setSelectedService(serv);
    setStep(2);
  };

  const handleTimeSelect = (timeStr: string) => {
    setSelectedTime(timeStr);
    setStep(3);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) {
      setErrorMsg("Selecione o serviço, data e horário antes de continuar.");
      return;
    }
    if (!clientName.trim()) {
      setErrorMsg("Por favor, digite seu nome completo.");
      return;
    }
    if (!clientPhone.trim() || clientPhone.length < 9) {
      setErrorMsg("Por favor, informe um telefone/WhatsApp válido com DDD.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const res = await createAppointment({
      serviceId: selectedService.id,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      careType,
      clientName,
      clientPhone,
      observations
    });

    if (res.success) {
      setSuccessData(res);
      setStep(4);
    } else {
      setErrorMsg(res.message || "Erro ao realizar agendamento.");
    }
    setSubmitting(false);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div id="agendar" className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 scroll-mt-24">
      {/* Header card */}
      <div className="bg-[#141414] border border-[#1F1F1F] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#006BFF]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="px-4 py-1.5 rounded-full bg-[#006BFF]/10 text-[#00A8FF] text-xs font-semibold uppercase tracking-widest border border-[#006BFF]/20 inline-block mb-3">
            Agendamento Instantâneo
          </span>
          <h2 className="font-bebas text-4xl sm:text-5xl tracking-wider text-white">MARQUE SUA SESSÃO EM <span className="text-[#006BFF]">60 SEGUNDOS</span></h2>
          <p className="text-slate-400 text-sm mt-2">Escolha seu serviço, data e horário com confirmação em tempo real. Pague somente de forma presencial.</p>

          {/* Stepper indicators */}
          <div className="flex items-center justify-center gap-3 mt-8 max-w-sm mx-auto">
            {[
              { num: 1, label: "Serviço" },
              { num: 2, label: "Data & Hora" },
              { num: 3, label: "Dados" },
              { num: 4, label: "Confirmação" }
            ].map(item => (
              <div key={item.num} className="flex items-center gap-2 group cursor-pointer" onClick={() => step > item.num && setStep(item.num)}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  step === item.num
                    ? "bg-[#006BFF] text-white shadow-lg shadow-[#006BFF]/30 scale-110"
                    : step > item.num
                    ? "bg-[#003A7A] text-white"
                    : "bg-[#1F1F1F] text-slate-500"
                }`}>
                  {step > item.num ? "✓" : item.num}
                </div>
                <span className={`text-xs hidden md:inline font-medium ${step === item.num ? "text-white" : "text-slate-500"}`}>
                  {item.label}
                </span>
                {item.num < 4 && <span className="w-4 h-0.5 bg-[#1F1F1F] ml-1"></span>}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: CHOOSE SERVICE */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="font-bebas text-2xl tracking-wider text-white flex items-center justify-between border-b border-[#1F1F1F] pb-3">
              <span>1. Selecione a Especialidade Desejada</span>
              <span className="text-xs font-sans text-slate-400 font-normal">Clique em um serviço para avançar</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialServices.map((serv) => {
                const isSelected = selectedService?.id === serv.id;
                return (
                  <div
                    key={serv.id}
                    onClick={() => handleServiceSelect(serv)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      isSelected
                        ? "border-[#006BFF] bg-[#006BFF]/10 shadow-xl shadow-[#006BFF]/10"
                        : "border-[#1F1F1F] bg-[#0F0F0F] hover:border-[#003A7A] hover:bg-[#1A1A1A]"
                    }`}
                  >
                    {serv.featured && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#006BFF] text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                        Mais Procurado
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#1F1F1F] overflow-hidden shrink-0 relative border border-slate-800">
                        <img src={serv.image} alt={serv.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0 pr-8">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#00A8FF]">{serv.category}</span>
                        <h4 className="font-bebas text-2xl text-white tracking-wide mt-0.5 group-hover:text-[#006BFF] transition-colors">
                          {serv.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-300 mt-2">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#006BFF]" /> {serv.durationMinutes} minutos</span>
                          <span className="text-[#006BFF] font-bold text-sm">R$ {Number(serv.price).toFixed(2).replace(".", ",")}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                      {serv.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE DATE & TIME */}
        {step === 2 && selectedService && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header / Selected Service recap bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[#0B0B0B] border border-[#1F1F1F] gap-4">
              <div>
                <span className="text-xs text-slate-500">Serviço Selecionado:</span>
                <h4 className="font-bebas text-xl text-white tracking-wide">{selectedService.title} <span className="text-sm font-sans font-medium text-[#00A8FF]">({selectedService.durationMinutes} min)</span></h4>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#006BFF] hover:underline flex items-center gap-1"
              >
                <span>Alterar Serviço</span>
              </button>
            </div>

            {/* Date selection horizontal picker */}
            <div>
              <h4 className="font-bebas text-2xl text-white tracking-wider mb-4">2. Escolha o Dia do Atendimento</h4>
              <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar">
                {datesList.map((dayItem) => {
                  const isSelected = selectedDate === dayItem.dateStr;
                  const isDisabled = dayItem.isSunday && !settings?.sundaysOpen;

                  return (
                    <button
                      key={dayItem.dateStr}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setSelectedDate(dayItem.dateStr)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl min-w-[80px] shrink-0 border transition-all ${
                        isDisabled
                          ? "border-slate-800 bg-[#0A0A0A] opacity-40 cursor-not-allowed"
                          : isSelected
                          ? "border-[#006BFF] bg-[#006BFF] text-white shadow-lg shadow-[#006BFF]/30 scale-105"
                          : "border-[#1F1F1F] bg-[#0F0F0F] hover:border-[#003A7A] hover:bg-[#1F1F1F] text-slate-300"
                      }`}
                    >
                      <span className={`text-[11px] font-semibold uppercase ${isSelected ? "text-white/80" : isDisabled ? "text-slate-600" : "text-[#00A8FF]"}`}>
                        {dayItem.dayName}
                      </span>
                      <span className={`text-base font-bold mt-1 ${isSelected ? "text-white" : isDisabled ? "text-slate-600" : "text-white"}`}>
                        {dayItem.label}
                      </span>
                      {isDisabled && <span className="text-[9px] text-red-400 mt-1">Fechado</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time selection slots */}
            <div>
              <h4 className="font-bebas text-2xl text-white tracking-wider mb-4 flex items-center justify-between">
                <span>3. Escolha o Horário</span>
                {loadingSlots && <span className="text-xs font-sans text-[#00A8FF] font-medium animate-pulse">Consultando agenda...</span>}
              </h4>

              {loadingSlots ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <div key={n} className="h-12 rounded-xl bg-[#1F1F1F] animate-pulse"></div>
                  ))}
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {availableSlots.map((slot) => {
                    const isSlotSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleTimeSelect(slot)}
                        className={`flex items-center justify-center py-3 px-4 rounded-xl font-medium text-sm border transition-all ${
                          isSlotSelected
                            ? "border-[#006BFF] bg-[#006BFF] text-white shadow-lg shadow-[#006BFF]/30 scale-105"
                            : "border-[#1F1F1F] bg-[#0F0F0F] text-slate-200 hover:border-[#003A7A] hover:bg-[#1A1A1A]"
                        }`}
                      >
                        <Clock className={`w-4 h-4 mr-2 ${isSlotSelected ? "text-white" : "text-[#006BFF]"}`} />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 rounded-2xl bg-[#0B0B0B] border border-slate-800 p-6">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                  <h5 className="text-base font-bold text-white">Nenhum Horário Disponível Neste Dia</h5>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">{slotReason || "A agenda de Crislan está completamente preenchida ou bloqueada nesta data. Por favor, selecione o dia seguinte."}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-8 border-t border-[#1F1F1F] mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-[#1F1F1F] text-sm text-slate-300 hover:bg-[#1F1F1F] hover:text-white transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CLIENT DETAILS FORM */}
        {step === 3 && selectedService && selectedDate && selectedTime && (
          <form onSubmit={handleBookingSubmit} className="space-y-6 animate-fadeIn">
            {/* Booking Summary Badge Header */}
            <div className="p-4 rounded-2xl bg-[#0B0B0B] border border-[#1F1F1F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                <span className="text-slate-400"><strong>Serviço:</strong> <span className="text-white">{selectedService.title}</span></span>
                <span className="text-slate-400"><strong>Data:</strong> <span className="text-[#00A8FF] font-semibold">{formatDateDisplay(selectedDate)}</span></span>
                <span className="text-slate-400"><strong>Horário:</strong> <span className="text-[#006BFF] font-bold text-sm">{selectedTime}</span></span>
                <span className="text-slate-400"><strong>Valor:</strong> <span className="text-white font-semibold">R$ {Number(selectedService.price).toFixed(2).replace(".", ",")}</span></span>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-[#006BFF] hover:underline"
              >
                Alterar Data/Hora
              </button>
            </div>

            <h4 className="font-bebas text-2xl text-white tracking-wider border-b border-[#1F1F1F] pb-3">
              4. Complete Com Seus Dados de Contato
            </h4>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Nome Completo *</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silva"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0B0B0B] border border-[#1F1F1F] focus:border-[#006BFF] focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">WhatsApp com DDD *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ex: (11) 98888-7777"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0B0B0B] border border-[#1F1F1F] focus:border-[#006BFF] focus:outline-none text-white text-sm"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Será usado para confirmar seu horário.</span>
              </div>
            </div>

            {/* Care Type Selection (Estúdio ou Domiciliar) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Local do Atendimento *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-all ${
                  careType === "studio" 
                    ? "border-[#006BFF] bg-[#006BFF]/10 text-white shadow-md shadow-[#006BFF]/10" 
                    : "border-[#1F1F1F] bg-[#0B0B0B] text-slate-400 hover:border-slate-700"
                }`}>
                  <input
                    type="radio"
                    name="careType"
                    value="studio"
                    checked={careType === "studio"}
                    onChange={() => setCareType("studio")}
                    className="sr-only"
                  />
                  <MapPin className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${careType === "studio" ? "text-[#006BFF]" : "text-slate-500"}`} />
                  <div>
                    <span className="font-semibold block text-sm text-white">No Estúdio do Massoterapeuta</span>
                    <span className="text-xs text-slate-400 mt-0.5 block">{settings?.address}</span>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-all ${
                  careType === "domiciliar" 
                    ? "border-[#006BFF] bg-[#006BFF]/10 text-white shadow-md shadow-[#006BFF]/10" 
                    : "border-[#1F1F1F] bg-[#0B0B0B] text-slate-400 hover:border-slate-700"
                }`}>
                  <input
                    type="radio"
                    name="careType"
                    value="domiciliar"
                    checked={careType === "domiciliar"}
                    onChange={() => setCareType("domiciliar")}
                    className="sr-only"
                  />
                  <User className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${careType === "domiciliar" ? "text-[#006BFF]" : "text-slate-500"}`} />
                  <div>
                    <span className="font-semibold block text-sm text-white">Atendimento Domiciliar (Home Care)</span>
                    <span className="text-xs text-slate-400 mt-0.5 block">Crislan vai até sua residência com maca e óleos</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Observations / Queixa */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Queixa Principal ou Observação <span className="text-slate-500 font-normal">(Opcional)</span></label>
              <textarea
                rows={3}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ex: Dores na lombar após treino intenso, ou foco em liberação de panturrilhas..."
                className="w-full p-4 rounded-xl bg-[#0B0B0B] border border-[#1F1F1F] focus:border-[#006BFF] focus:outline-none text-white text-sm resize-none"
              ></textarea>
            </div>

            {/* Payment reminder note */}
            <div className="p-4 rounded-2xl bg-[#070707] border border-slate-800 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#00A8FF] shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Pagamento Seguro:</strong> Nenhum pagamento é exigido online. Você realizará o acerto de <strong>R$ {Number(selectedService.price).toFixed(2).replace(".", ",")}</strong> presencialmente com o profissional no momento do seu atendimento (Pix ou Dinheiro).
              </p>
            </div>

            {/* Submit Action buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-[#1F1F1F]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-[#1F1F1F] text-sm text-slate-300 hover:bg-[#1F1F1F] hover:text-white transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 rounded-xl bg-[#006BFF] hover:bg-[#003A7A] text-white font-semibold flex items-center gap-3 shadow-lg shadow-[#006BFF]/30 hover:scale-105 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    <span>Confirmando Vaga...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar Agendamento</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: SUCCESS & WHATSAPP CONFIRMATION CTA */}
        {step === 4 && successData && selectedService && (
          <div className="text-center space-y-6 py-6 animate-fadeIn max-w-xl mx-auto">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="font-bebas text-4xl text-white tracking-wider">AGENDAMENTO REGISTRADO COM SUCESSO!</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Olá <strong>{successData.appointment?.clientName}</strong>, sua vaga foi garantida e salva na agenda oficial de Crislan.
              </p>
            </div>

            {/* Summary card */}
            <div className="bg-[#0B0B0B] border border-[#1F1F1F] rounded-2xl p-6 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Código de Confirmação:</span>
                <span className="font-bebas text-xl text-[#00A8FF]">#CRIS-{successData.appointment?.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-slate-500 block">Serviço:</span>
                  <span className="font-bold text-white block text-sm mt-0.5">{successData.serviceTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Investimento:</span>
                  <span className="font-bold text-emerald-400 block text-sm mt-0.5">R$ {Number(successData.appointment?.price || selectedService.price).toFixed(2).replace(".", ",")}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Data:</span>
                  <span className="font-bold text-white block text-sm mt-0.5">{formatDateDisplay(successData.appointment?.appointmentDate)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Horário:</span>
                  <span className="font-bold text-[#006BFF] block text-sm mt-0.5">{successData.appointment?.appointmentTime}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-500 block text-xs">Tipo e Local:</span>
                <span className="text-slate-200 block text-xs mt-0.5">
                  {successData.appointment?.careType === "domiciliar" ? "🏠 Atendimento Domiciliar (Home Care)" : "📍 Estúdio Crislan Massoterapeuta"}
                </span>
              </div>
            </div>

            {/* Google Calendar Link calculation */}
            {(() => {
              const [y, m, d] = (successData.appointment?.appointmentDate || selectedDate).split("-");
              const [h, min] = (successData.appointment?.appointmentTime || selectedTime).split(":");
              const dateIso = `${y}${m}${d}T${h}${min}00`;
              
              // Add duration
              const endObj = new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min));
              endObj.setMinutes(endObj.getMinutes() + selectedService.durationMinutes);
              const endY = endObj.getFullYear();
              const endM = String(endObj.getMonth() + 1).padStart(2, "0");
              const endD = String(endObj.getDate()).padStart(2, "0");
              const endH = String(endObj.getHours()).padStart(2, "0");
              const endMin = String(endObj.getMinutes()).padStart(2, "0");
              const dateEndIso = `${endY}${endM}${endD}T${endH}${endMin}00`;

              const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Sessão de Massoterapia - " + successData.serviceTitle)}&dates=${dateIso}/${dateEndIso}&details=${encodeURIComponent("Sessão agendada com Crislan Massoterapeuta.")}&location=${encodeURIComponent(successData.appointment?.careType === "domiciliar" ? "Atendimento Domiciliar" : settings?.address)}`;

              const finalWhatsappMsg = `Olá Crislan! Acabei de registrar meu agendamento no site:\n\n*Serviço:* ${successData.serviceTitle}\n*Data:* ${formatDateDisplay(successData.appointment?.appointmentDate)}\n*Horário:* ${successData.appointment?.appointmentTime}\n*Nome:* ${successData.appointment?.clientName}\n*Local:* ${successData.appointment?.careType === "domiciliar" ? "Domiciliar" : "Estúdio"}\n\nCódigo: #CRIS-${successData.appointment?.id}`;
              const directWhatsappUrl = `https://wa.me/${successData.whatsappNumber}?text=${encodeURIComponent(finalWhatsappMsg)}`;

              return (
                <div className="flex flex-col gap-3 pt-4">
                  <a
                    href={directWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/25 hover:scale-102 transition-all"
                  >
                    <Phone className="w-5 h-5 fill-white" />
                    <span>Enviar Confirmação Rápida no WhatsApp</span>
                  </a>

                  <a
                    href={gCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-[#1F1F1F] hover:bg-[#2A2A2A] text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-800 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-[#00A8FF]" />
                    <span>Adicionar Lembrete ao Meu Google Calendar</span>
                  </a>
                </div>
              );
            })()}

            <div className="pt-6">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setSelectedService(null);
                  setSelectedDate("");
                  setSelectedTime("");
                  setClientName("");
                  setClientPhone("");
                  setObservations("");
                  setSuccessData(null);
                }}
                className="text-xs text-[#006BFF] hover:underline"
              >
                Fazer Novo Agendamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
