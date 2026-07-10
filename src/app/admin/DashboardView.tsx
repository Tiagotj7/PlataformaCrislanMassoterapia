"use client";

import { useState } from "react";
import Link from "next/link";
import { updateAppointmentStatus, deleteAppointmentAction } from "@/app/actions/admin";
import { Calendar, Users, Briefcase, Clock, MapPin, Phone, User, CheckCircle2, XCircle, Trash2, ArrowUpRight, Flame, BarChart3, TrendingUp, Sparkles, AlertCircle } from "lucide-react";

interface AppItem {
  id: number;
  clientId: number;
  serviceId: number;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  careType: string;
  clientName: string;
  clientPhone: string;
  observations: string | null;
  price: string;
  status: string;
}

interface DashboardViewProps {
  initialTodayApps: AppItem[];
  initialNextApp: AppItem | null;
  totalClients: number;
  recentClients: any[];
  initialWeeklyApps: AppItem[];
  servicesCount: number;
}

export function DashboardView({
  initialTodayApps,
  initialNextApp,
  totalClients,
  recentClients,
  initialWeeklyApps,
  servicesCount,
}: DashboardViewProps) {
  const [todayApps, setTodayApps] = useState<AppItem[]>(initialTodayApps);
  const [weeklyApps, setWeeklyApps] = useState<AppItem[]>(initialWeeklyApps);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    const res = await updateAppointmentStatus(id, newStatus);
    if (res.success) {
      // Update local state
      setTodayApps(todayApps.map(app => app.id === id ? { ...app, status: newStatus } : app));
      setWeeklyApps(weeklyApps.map(app => app.id === id ? { ...app, status: newStatus } : app));
    }
    setUpdatingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento do sistema?")) return;
    setUpdatingId(id);
    const res = await deleteAppointmentAction(id);
    if (res.success) {
      setTodayApps(todayApps.filter(app => app.id !== id));
      setWeeklyApps(weeklyApps.filter(app => app.id !== id));
    }
    setUpdatingId(null);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}`;
  };

  // Calculate monthly stats proxy
  const completedCount = weeklyApps.filter(a => a.status === "completed" || a.status === "confirmed").length;
  const estimatedRevenue = weeklyApps
    .filter(a => a.status === "completed" || a.status === "confirmed")
    .reduce((acc, curr) => acc + Number(curr.price), 0);

  return (
    <div className="space-y-10 animate-fadeIn pb-24">
      
      {/* Top Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#003A7A] via-[#006BFF] to-[#00A8FF] text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md mb-3 inline-block">
            Painel Central de Controle
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide">BEM-VINDO, CRISLAN MASSOTERAPEUTA!</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Aqui você tem controle absoluto da sua rotina de agendamentos, fichas de pacientes e parâmetros de funcionamento do sistema.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/agenda"
            className="px-6 py-3 rounded-2xl bg-white text-[#003A7A] font-bold text-xs hover:bg-slate-100 shadow-lg transition-transform hover:scale-105"
          >
            + Novo Agendamento / Férias
          </Link>
        </div>
      </div>

      {/* Key Metrics Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Atendimentos de Hoje */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Agendamentos de Hoje</span>
            <span className="font-bebas text-4xl text-white tracking-wide mt-1 block">{todayApps.length}</span>
            <span className="text-[11px] text-[#00A8FF] font-medium block mt-1">
              {todayApps.filter(a => a.status === "confirmed").length} aguardando atendimento
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#006BFF]/10 text-[#006BFF] flex items-center justify-center shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
        </div>

        {/* Metric 2: Clientes Cadastrados */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Clientes na Base</span>
            <span className="font-bebas text-4xl text-white tracking-wide mt-1 block">{totalClients}</span>
            <Link href="/admin/clients" className="text-[11px] text-[#006BFF] hover:underline block mt-1 font-semibold flex items-center gap-1">
              <span>Ver todos os pacientes</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#00A8FF]/10 text-[#00A8FF] flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Metric 3: Faturamento Semanal Estimado */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Receita Semanal Estimada</span>
            <span className="font-bebas text-4xl text-emerald-400 tracking-wide mt-1 block">
              R$ {estimatedRevenue.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-[11px] text-emerald-500 font-medium block mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Baseado nos {completedCount} agendamentos</span>
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <BarChart3 className="w-7 h-7" />
          </div>
        </div>

        {/* Metric 4: Serviços Ativos */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Protocolos Ativos</span>
            <span className="font-bebas text-4xl text-white tracking-wide mt-1 block">{servicesCount}</span>
            <Link href="/admin/services" className="text-[11px] text-[#006BFF] hover:underline block mt-1 font-semibold flex items-center gap-1">
              <span>Gerenciar catálogo</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <Briefcase className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Highlighted Next App and Today's Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Próximo Atendimento em Destaque & Agenda do Dia */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* PRÓXIMO ATENDIMENTO EM DESTAQUE */}
          {initialNextApp && (
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1A1A1A] to-[#141414] border-2 border-[#006BFF] shadow-2xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#006BFF]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="px-3 py-1 rounded-lg bg-[#006BFF] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>Atendimento Imediato em Destaque</span>
                </span>
                <span className="text-sm font-bebas text-[#00A8FF]">Hoje às {initialNextApp.appointmentTime}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Paciente:</span>
                  <h3 className="font-bebas text-3xl text-white tracking-wide mt-0.5">{initialNextApp.clientName}</h3>
                  <a
                    href={`https://wa.me/${initialNextApp.clientPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#00A8FF] hover:underline flex items-center gap-1 mt-1 font-medium"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{initialNextApp.clientPhone}</span>
                  </a>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Procedimento:</span>
                  <h4 className="font-bebas text-2xl text-slate-200 mt-0.5">{initialTodayApps.find(a => a.id === initialNextApp.id)?.price ? `Sessão R$ ${initialNextApp.price}` : "Sessão Massoterapia"}</h4>
                  <span className="text-xs text-slate-400 block mt-1">
                    Modalidade: <strong>{initialNextApp.careType === "domiciliar" ? "🏠 Domiciliar (Home Care)" : "📍 Estúdio Crislan"}</strong>
                  </span>
                </div>
              </div>

              {initialNextApp.observations && (
                <div className="mt-6 p-4 rounded-xl bg-[#0B0B0B] border border-slate-800 text-xs text-slate-300">
                  <strong>Queixa / Nota:</strong> {initialNextApp.observations}
                </div>
              )}
            </div>
          )}

          {/* AGENDAMENTOS DO DIA */}
          <div className="bg-[#141414] border border-[#1F1F1F] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
              <div>
                <h3 className="font-bebas text-2xl tracking-wider text-white">ATENDIMENTOS DE HOJE</h3>
                <span className="text-xs text-slate-400">{new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <Link href="/admin/agenda" className="text-xs text-[#006BFF] hover:underline font-semibold flex items-center gap-1">
                <span>Ver agenda completa</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {todayApps.length > 0 ? (
              <div className="space-y-4">
                {todayApps.map((app) => {
                  return (
                    <div
                      key={app.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        app.status === "completed"
                          ? "border-emerald-500/30 bg-emerald-500/5 opacity-80"
                          : app.status === "cancelled"
                          ? "border-red-500/30 bg-red-500/5 opacity-50"
                          : "border-[#1F1F1F] bg-[#0B0B0B] hover:border-[#006BFF]/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-slate-800 flex items-center justify-center font-bebas text-2xl text-[#006BFF] shrink-0">
                          {app.appointmentTime}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bebas text-2xl text-white tracking-wide">{app.clientName}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              app.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                              app.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                              "bg-[#006BFF]/20 text-[#00A8FF]"
                            }`}>
                              {app.status === "completed" ? "Concluído" : app.status === "cancelled" ? "Cancelado" : "Confirmado"}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                            <a href={`https://wa.me/${app.clientPhone}`} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#006BFF]" />
                              <span>{app.clientPhone}</span>
                            </a>
                            <span>|</span>
                            <span>{app.careType === "domiciliar" ? "🏠 Domiciliar" : "📍 Estúdio"}</span>
                            <span>|</span>
                            <span className="text-emerald-400 font-semibold">R$ {Number(app.price).toFixed(2).replace(".", ",")}</span>
                          </div>

                          {app.observations && (
                            <p className="text-xs text-slate-500 italic mt-2">"{app.observations}"</p>
                          )}
                        </div>
                      </div>

                      {/* Action Status buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800 shrink-0">
                        {updatingId === app.id ? (
                          <span className="text-xs text-[#00A8FF] animate-pulse">Atualizando...</span>
                        ) : (
                          <>
                            {app.status !== "completed" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(app.id, "completed")}
                                title="Marcar como Atendimento Concluído"
                                className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                            )}

                            {app.status !== "confirmed" && app.status !== "cancelled" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(app.id, "confirmed")}
                                title="Reverter para Status Confirmado"
                                className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                              >
                                <Clock className="w-5 h-5" />
                              </button>
                            )}

                            {app.status !== "cancelled" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(app.id, "cancelled")}
                                title="Cancelar Agendamento"
                                className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDelete(app.id)}
                              title="Excluir do Banco de Dados"
                              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl bg-[#0B0B0B] border border-slate-800 p-6">
                <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h5 className="text-base font-bold text-white">Nenhum Atendimento Pendente Hoje</h5>
                <p className="text-xs text-slate-400 mt-1">Sua agenda de hoje está completamente livre ou concluída.</p>
              </div>
            )}
          </div>

          {/* AGENDA SEMANAL RESUMO */}
          <div className="bg-[#141414] border border-[#1F1F1F] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
              <div>
                <h3 className="font-bebas text-2xl tracking-wider text-white">AGENDA DOS PRÓXIMOS 7 DIAS</h3>
                <span className="text-xs text-slate-400">Resumo de compromissos futuros</span>
              </div>
              <Link href="/admin/agenda" className="text-xs text-[#006BFF] hover:underline font-semibold flex items-center gap-1">
                <span>Gerenciar Férias / Bloqueios</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {weeklyApps.length > 0 ? (
              <div className="divide-y divide-slate-800/80">
                {weeklyApps.slice(0, 8).map((wApp) => (
                  <div key={wApp.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-bebas text-lg text-white">{wApp.clientName}</span>
                      <span className="text-xs text-slate-400 block">
                        <strong className="text-[#00A8FF]">{formatDateDisplay(wApp.appointmentDate)}</strong> às <strong className="text-[#006BFF]">{wApp.appointmentTime}</strong> | {wApp.careType === "domiciliar" ? "🏠 Domiciliar" : "📍 Estúdio"}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      wApp.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      wApp.status === "cancelled" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      "bg-[#006BFF]/10 text-[#00A8FF] border border-[#006BFF]/20"
                    }`}>
                      {wApp.status === "completed" ? "Concluído" : wApp.status === "cancelled" ? "Cancelado" : "Confirmado"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">Nenhum agendamento confirmado para os próximos 7 dias.</div>
            )}
          </div>

        </div>

        {/* Right Column: Últimos Clientes & Atalhos */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* RECENT CLIENTS */}
          <div className="bg-[#141414] border border-[#1F1F1F] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
              <h3 className="font-bebas text-xl tracking-wider text-white">ÚLTIMOS PACIENTES CADASTRADOS</h3>
              <Link href="/admin/clients" className="text-xs text-[#006BFF] hover:underline font-semibold">Ver todos</Link>
            </div>

            <div className="space-y-4">
              {recentClients.map((client) => (
                <div key={client.id} className="p-4 rounded-2xl bg-[#0B0B0B] border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#1F1F1F] text-slate-300 flex items-center justify-center font-bebas text-lg shrink-0">
                      {client.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bebas text-lg text-white tracking-wide truncate">{client.name}</h5>
                      <span className="text-[11px] text-slate-400 block truncate">{client.phone}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-[#1F1F1F] text-[10px] font-bold text-[#00A8FF] shrink-0">
                    {client.appointmentsCount} sessões
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ATALHOS RAPIDOS ADMIN */}
          <div className="bg-[#141414] border border-[#1F1F1F] rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h3 className="font-bebas text-xl tracking-wider text-white border-b border-[#1F1F1F] pb-3">AÇÕES ADMINISTRATIVAS RÁPIDAS</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/admin/services" className="p-4 rounded-2xl bg-[#0B0B0B] border border-slate-800 hover:border-[#006BFF] text-white flex items-center justify-between text-xs font-semibold group transition-colors">
                <span>⚙️ Atualizar Preços dos Protocolos</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#006BFF]" />
              </Link>
              <Link href="/admin/agenda" className="p-4 rounded-2xl bg-[#0B0B0B] border border-slate-800 hover:border-[#006BFF] text-white flex items-center justify-between text-xs font-semibold group transition-colors">
                <span>🏖️ Criar Férias ou Bloquear Datas</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#006BFF]" />
              </Link>
              <Link href="/admin/settings" className="p-4 rounded-2xl bg-[#0B0B0B] border border-slate-800 hover:border-[#006BFF] text-white flex items-center justify-between text-xs font-semibold group transition-colors">
                <span>📱 Alterar Mensagem Automática do WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#006BFF]" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
