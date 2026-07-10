"use client";

import { useState } from "react";
import { updateAppointmentStatus, deleteAppointmentAction, addBlockedDateAction, deleteBlockedDateAction, addBlockedHourAction, deleteBlockedHourAction } from "@/app/actions/admin";
import { createAppointment } from "@/app/actions/booking";
import { Calendar, Clock, User, Phone, CheckCircle2, XCircle, Trash2, Plus, ShieldAlert, Filter, MapPin, Sparkles } from "lucide-react";

interface AgendaManagerProps {
  initialAppointments: any[];
  initialBlockedDates: any[];
  initialBlockedHours: any[];
  servicesList: any[];
  clientsList: any[];
}

export function AgendaManager({
  initialAppointments,
  initialBlockedDates,
  initialBlockedHours,
  servicesList,
  clientsList
}: AgendaManagerProps) {
  // Tabs: 'lista' | 'manual' | 'ferias'
  const [activeTab, setActiveTab] = useState<string>("lista");

  // Appointments View State
  const [appointments, setAppointments] = useState<any[]>(initialAppointments);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<string>("diario"); // 'diario' | 'semanal' | 'mensal' | 'todos'

  // Blocks State
  const [blockedDates, setBlockedDates] = useState<any[]>(initialBlockedDates);
  const [blockedHours, setBlockedHours] = useState<any[]>(initialBlockedHours);

  // Form State: Manual Appointment
  const [mServiceId, setMServiceId] = useState<number>(servicesList[0]?.id || 0);
  const [mDate, setMDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [mTime, setMTime] = useState<string>("10:00");
  const [mClientName, setMClientName] = useState<string>("");
  const [mClientPhone, setMClientPhone] = useState<string>("");
  const [mCareType, setMCareType] = useState<string>("studio");
  const [mObs, setMObs] = useState<string>("");
  const [mSubmitting, setMSubmitting] = useState<boolean>(false);
  const [mMsg, setMMsg] = useState<string>("");

  // Form State: Vacation / Block Date
  const [bDate, setBDate] = useState<string>("");
  const [bReason, setBReason] = useState<string>("Férias / Recesso");
  const [bSubmitting, setBSubmitting] = useState<boolean>(false);

  // Form State: Block Hour
  const [bhHour, setBhHour] = useState<string>("12:00");
  const [bhDate, setBhDate] = useState<string>(""); // optional
  const [bhReason, setBhReason] = useState<string>("Almoço / Bloqueio");
  const [bhSubmitting, setBhSubmitting] = useState<boolean>(false);

  // Handlers for Appointments
  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await updateAppointmentStatus(id, newStatus);
    if (res.success) {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
    }
  };

  const handleDeleteApp = async (id: number) => {
    if (!confirm("Confirmar exclusão definitiva deste agendamento?")) return;
    const res = await deleteAppointmentAction(id);
    if (res.success) {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  // Handlers for Manual Submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mClientName || !mClientPhone) {
      setMMsg("Preencha nome e telefone do cliente.");
      return;
    }
    setMSubmitting(true);
    setMMsg("");

    const res = await createAppointment({
      serviceId: Number(mServiceId),
      appointmentDate: mDate,
      appointmentTime: mTime,
      careType: mCareType,
      clientName: mClientName,
      clientPhone: mClientPhone,
      observations: mObs ? `Agendado pelo Admin: ${mObs}` : "Agendado pelo Admin"
    });

    if (res.success) {
      setMMsg("✓ Agendamento salvo com sucesso!");
      // Add to local list
      if (res.appointment) {
        setAppointments([res.appointment, ...appointments]);
      }
      setTimeout(() => setMMsg(""), 3000);
      setMClientName("");
      setMClientPhone("");
      setMObs("");
    } else {
      setMMsg("Erro: " + (res.message || "Não foi possível agendar."));
    }
    setMSubmitting(false);
  };

  // Handlers for Block Date
  const handleAddBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bDate) return;
    setBSubmitting(true);
    const res = await addBlockedDateAction(bDate, bReason);
    if (res.success) {
      setBlockedDates([{ id: Date.now(), blockedDate: bDate, reason: bReason }, ...blockedDates]);
      setBDate("");
      setBReason("Férias / Recesso");
    }
    setBSubmitting(false);
  };

  const handleDeleteBlockDate = async (id: number) => {
    const res = await deleteBlockedDateAction(id);
    if (res.success) {
      setBlockedDates(blockedDates.filter(b => b.id !== id));
    }
  };

  // Handlers for Block Hour
  const handleAddBlockHour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bhHour) return;
    setBhSubmitting(true);
    const res = await addBlockedHourAction(bhHour, bhReason, bhDate || undefined);
    if (res.success) {
      setBlockedHours([{ id: Date.now(), hour: bhHour, reason: bhReason, specificDate: bhDate || null }, ...blockedHours]);
      setBhDate("");
    }
    setBhSubmitting(false);
  };

  const handleDeleteBlockHour = async (id: number) => {
    const res = await deleteBlockedHourAction(id);
    if (res.success) {
      setBlockedHours(blockedHours.filter(b => b.id !== id));
    }
  };

  // Filter logic
  const filteredAppointments = appointments.filter(app => {
    // Status filter
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = app.clientName.toLowerCase().includes(q);
      const matchPhone = app.clientPhone.toLowerCase().includes(q);
      if (!matchName && !matchPhone) return false;
    }
    // View mode date filter
    const todayStr = new Date().toISOString().split("T")[0];
    if (viewMode === "diario") {
      if (app.appointmentDate !== todayStr) return false;
    } else if (viewMode === "semanal") {
      const nextWeekObj = new Date();
      nextWeekObj.setDate(nextWeekObj.getDate() + 7);
      const nextWeekStr = nextWeekObj.toISOString().split("T")[0];
      if (app.appointmentDate < todayStr || app.appointmentDate > nextWeekStr) return false;
    } else if (viewMode === "mensal") {
      const currentMonth = todayStr.substring(0, 7);
      if (!app.appointmentDate?.startsWith(currentMonth)) return false;
    }
    return true;
  });

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      
      {/* Page Title */}
      <div>
        <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wider">GERENCIAMENTO DA AGENDA OFICIAL</h1>
        <p className="text-slate-400 text-sm mt-1">Consulte agendamentos, adicione horários manualmente ou programe férias e bloqueios de agenda.</p>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[#1F1F1F] pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("lista")}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "lista"
              ? "bg-[#006BFF] text-white shadow-lg shadow-[#006BFF]/30"
              : "bg-[#141414] text-slate-400 hover:bg-[#1F1F1F] hover:text-white border border-[#1F1F1F]"
          }`}
        >
          📅 Lista & Consultas ({filteredAppointments.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "manual"
              ? "bg-[#006BFF] text-white shadow-lg shadow-[#006BFF]/30"
              : "bg-[#141414] text-slate-400 hover:bg-[#1F1F1F] hover:text-white border border-[#1F1F1F]"
          }`}
        >
          + Cadastrar Agendamento Manual
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ferias")}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "ferias"
              ? "bg-[#006BFF] text-white shadow-lg shadow-[#006BFF]/30"
              : "bg-[#141414] text-slate-400 hover:bg-[#1F1F1F] hover:text-white border border-[#1F1F1F]"
          }`}
        >
          🏖️ Férias & Bloqueios de Agenda
        </button>
      </div>

      {/* TAB 1: LISTA E CONSULTAS */}
      {activeTab === "lista" && (
        <div className="space-y-6">
          
          {/* Controls bar: View mode, Status filter, Search */}
          <div className="p-6 rounded-3xl bg-[#141414] border border-[#1F1F1F] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xl">
            
            {/* View Modes */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <span className="text-xs text-slate-500 font-semibold mr-2 shrink-0">Visualizar:</span>
              {[
                { id: "diario", label: "Hoje" },
                { id: "semanal", label: "7 Dias" },
                { id: "mensal", label: "Este Mês" },
                { id: "todos", label: "Todo o Histórico" }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setViewMode(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                    viewMode === item.id ? "bg-[#003A7A] text-white border border-[#006BFF]" : "bg-[#0B0B0B] text-slate-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-auto">
                <Filter className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-8 py-2.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-xs focus:border-[#006BFF] focus:outline-none font-medium cursor-pointer"
                >
                  <option value="all">Todos os Status</option>
                  <option value="confirmed">Confirmados (Pendentes)</option>
                  <option value="completed">Atendimentos Concluídos</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por nome ou telefone..."
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-xs focus:border-[#006BFF] focus:outline-none"
              />
            </div>
          </div>

          {/* Appointments Grid / Card List */}
          <div className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl ${
                    app.status === "completed"
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : app.status === "cancelled"
                      ? "border-red-500/20 bg-red-500/5 opacity-60"
                      : "border-[#1F1F1F] bg-[#141414] hover:border-[#006BFF]/60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full md:w-auto">
                    <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-[#0B0B0B] border border-slate-800 text-center shrink-0 shadow-md">
                      <span className="font-bebas text-2xl text-[#006BFF] leading-none">{app.appointmentTime}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase mt-1">{formatDateDisplay(app.appointmentDate).substring(0, 5)}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1F1F1F] text-[11px] font-semibold text-[#00A8FF]">
                          #{app.id}
                        </span>
                        <h4 className="font-bebas text-3xl text-white tracking-wide">{app.clientName}</h4>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          app.status === "completed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                          app.status === "cancelled" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                          "bg-[#006BFF]/20 text-[#00A8FF] border border-[#006BFF]/30"
                        }`}>
                          {app.status === "completed" ? "Concluído" : app.status === "cancelled" ? "Cancelado" : "Confirmado"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <a href={`https://wa.me/${app.clientPhone}`} target="_blank" rel="noopener noreferrer" className="hover:text-white font-medium flex items-center gap-1 text-[#00A8FF]">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{app.clientPhone}</span>
                        </a>
                        <span>•</span>
                        <span className="text-slate-300">{servicesList.find(s => s.id === app.serviceId)?.title || "Sessão Massoterapia"} ({app.durationMinutes} min)</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">R$ {Number(app.price).toFixed(2).replace(".", ",")}</span>
                      </div>

                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Local:</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {app.careType === "domiciliar" ? "🏠 Atendimento Domiciliar (Home Care)" : "📍 Estúdio Crislan"}
                        </span>
                      </div>

                      {app.observations && (
                        <p className="text-xs text-slate-400 bg-[#0B0B0B] p-3 rounded-xl border border-slate-800/80 mt-2">
                          <strong>Observação:</strong> {app.observations}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-800 shrink-0">
                    {app.status !== "completed" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(app.id, "completed")}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Concluir</span>
                      </button>
                    )}

                    {app.status !== "confirmed" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(app.id, "confirmed")}
                        className="px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-xs transition-colors"
                      >
                        Confirmar
                      </button>
                    )}

                    {app.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(app.id, "cancelled")}
                        className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs transition-colors"
                      >
                        Cancelar
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteApp(app.id)}
                      title="Excluir Definitivamente"
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 rounded-3xl bg-[#141414] border border-[#1F1F1F] p-8">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h5 className="text-lg font-bold text-white">Nenhum Registro Encontrado</h5>
                <p className="text-xs text-slate-400 mt-1">Tente alterar os filtros de status ou modo de visualização.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: CADASTRAR AGENDAMENTO MANUAL */}
      {activeTab === "manual" && (
        <div className="max-w-2xl mx-auto bg-[#141414] border border-[#1F1F1F] rounded-3xl p-8 shadow-2xl">
          <h3 className="font-bebas text-3xl tracking-wider text-white border-b border-[#1F1F1F] pb-4 mb-6">
            ADICIONAR NOVO COMPROMISSO MANUALMENTE
          </h3>

          {mMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs mb-6 font-semibold">
              {mMsg}
            </div>
          )}

          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Serviço / Protocolo</label>
              <select
                value={mServiceId}
                onChange={(e) => setMServiceId(Number(e.target.value))}
                className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-sm focus:border-[#006BFF] focus:outline-none"
              >
                {servicesList.map(s => (
                  <option key={s.id} value={s.id}>{s.title} — R$ {s.price} ({s.durationMinutes} min)</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Data do Atendimento</label>
                <input
                  type="date"
                  required
                  value={mDate}
                  onChange={(e) => setMDate(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-sm focus:border-[#006BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Horário (Ex: 14:00)</label>
                <input
                  type="text"
                  required
                  value={mTime}
                  onChange={(e) => setMTime(e.target.value)}
                  placeholder="14:00"
                  className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-sm focus:border-[#006BFF] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Nome do Paciente *</label>
                <input
                  type="text"
                  required
                  value={mClientName}
                  onChange={(e) => setMClientName(e.target.value)}
                  placeholder="Nome Completo"
                  className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-sm focus:border-[#006BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">WhatsApp / Telefone *</label>
                <input
                  type="text"
                  required
                  value={mClientPhone}
                  onChange={(e) => setMClientPhone(e.target.value)}
                  placeholder="(11) 99999-8888"
                  className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-sm focus:border-[#006BFF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Modalidade do Atendimento</label>
              <select
                value={mCareType}
                onChange={(e) => setMCareType(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-sm focus:border-[#006BFF] focus:outline-none"
              >
                <option value="studio">📍 Atendimento no Estúdio Crislan</option>
                <option value="domiciliar">🏠 Atendimento Domiciliar (Home Care)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Observações Adicionais</label>
              <textarea
                rows={3}
                value={mObs}
                onChange={(e) => setMObs(e.target.value)}
                placeholder="Notas que ficarão salvas na ficha..."
                className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-sm focus:border-[#006BFF] focus:outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={mSubmitting}
              className="w-full py-4 rounded-xl bg-[#006BFF] hover:bg-[#003A7A] text-white font-bold text-sm shadow-xl shadow-[#006BFF]/25 hover:scale-102 transition-all"
            >
              {mSubmitting ? "Salvando..." : "Registrar Agendamento Manual na Agenda"}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: FÉRIAS E BLOQUEIOS */}
      {activeTab === "ferias" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Bloquear Data Total */}
          <div className="bg-[#141414] border border-[#1F1F1F] rounded-3xl p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-bebas text-3xl tracking-wider text-white border-b border-[#1F1F1F] pb-3">
                1. BLOQUEAR DATA COMPLETA (FÉRIAS OU EVENTO)
              </h3>
              <p className="text-xs text-slate-400 mt-2">Impede novos agendamentos em todos os horários deste dia específico.</p>

              <form onSubmit={handleAddBlockDate} className="space-y-4 mt-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Data a Bloquear</label>
                  <input
                    type="date"
                    required
                    value={bDate}
                    onChange={(e) => setBDate(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-xs focus:border-[#006BFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Motivo / Descrição</label>
                  <input
                    type="text"
                    required
                    value={bReason}
                    onChange={(e) => setBReason(e.target.value)}
                    placeholder="Ex: Férias do Massoterapeuta / Competição de CrossFit"
                    className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-xs focus:border-[#006BFF] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bSubmitting}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all"
                >
                  {bSubmitting ? "Bloqueando..." : "Bloquear Dia Inteiro na Agenda"}
                </button>
              </form>

              <div className="space-y-3 mt-8 pt-6 border-t border-slate-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Datas Bloqueadas Atualmente</h4>
                {blockedDates.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {blockedDates.map((item) => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 flex items-center justify-between text-xs gap-3">
                        <div>
                          <span className="font-bold text-red-400">{formatDateDisplay(item.blockedDate)}</span>
                          <span className="text-slate-400 block text-[11px] mt-0.5">{item.reason}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlockDate(item.id)}
                          title="Desbloquear Data"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors text-[10px] font-semibold"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Nenhuma data bloqueada.</p>
                )}
              </div>
            </div>
          </div>

          {/* Bloquear Horário Recorrente */}
          <div className="bg-[#141414] border border-[#1F1F1F] rounded-3xl p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-bebas text-3xl tracking-wider text-white border-b border-[#1F1F1F] pb-3">
                2. BLOQUEAR HORÁRIOS PONTUAIS
              </h3>
              <p className="text-xs text-slate-400 mt-2">Bloqueie uma hora específica de um dia ou recorrentemente para almoço/tarefas.</p>

              <form onSubmit={handleAddBlockHour} className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Horário (Ex: 12:00)</label>
                    <input
                      type="text"
                      required
                      value={bhHour}
                      onChange={(e) => setBhHour(e.target.value)}
                      placeholder="12:00"
                      className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-xs focus:border-[#006BFF] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Data Opcional</label>
                    <input
                      type="date"
                      value={bhDate}
                      onChange={(e) => setBhDate(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-xs focus:border-[#006BFF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Motivo</label>
                  <input
                    type="text"
                    required
                    value={bhReason}
                    onChange={(e) => setBhReason(e.target.value)}
                    placeholder="Ex: Almoço / Reunião do Estúdio"
                    className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-xs focus:border-[#006BFF] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bhSubmitting}
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition-all"
                >
                  {bhSubmitting ? "Bloqueando..." : "Bloquear Esta Hora na Agenda"}
                </button>
              </form>

              <div className="space-y-3 mt-8 pt-6 border-t border-slate-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Horários Bloqueados</h4>
                {blockedHours.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {blockedHours.map((bh) => (
                      <div key={bh.id} className="p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 flex items-center justify-between text-xs gap-3">
                        <div>
                          <span className="font-bold text-amber-400">{bh.hour}</span>
                          {bh.specificDate && <span className="text-slate-400 text-[10px] ml-2">({formatDateDisplay(bh.specificDate)})</span>}
                          <span className="text-slate-400 block text-[11px] mt-0.5">{bh.reason}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlockHour(bh.id)}
                          title="Remover Bloqueio"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors text-[10px] font-semibold"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Nenhum horário pontual bloqueado.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
