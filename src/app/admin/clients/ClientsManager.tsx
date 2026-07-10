"use client";

import { useState } from "react";
import { saveClientAction, deleteClientAction } from "@/app/actions/admin";
import { Users, Search, Phone, Mail, FileText, Edit, Trash2, Plus, X, ArrowUpRight, CheckCircle2, ShieldAlert } from "lucide-react";

interface ClientItem {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  appointmentsCount: number;
  createdAt: any;
}

interface ClientsManagerProps {
  initialClients: ClientItem[];
}

export function ClientsManager({ initialClients }: ClientsManagerProps) {
  const [clients, setClients] = useState<ClientItem[]>(initialClients);
  const [search, setSearch] = useState<string>("");
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form states
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    phone: "",
    email: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  const handleOpenNew = () => {
    setFormData({ id: 0, name: "", phone: "", email: "", notes: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cli: ClientItem) => {
    setFormData({
      id: cli.id,
      name: cli.name,
      phone: cli.phone,
      email: cli.email || "",
      notes: cli.notes || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitting(true);
    setMsg("");

    const res = await saveClientAction(formData);
    if (res.success) {
      if (formData.id) {
        // Updated
        setClients(clients.map(c => c.id === formData.id ? {
          ...c,
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          notes: formData.notes || null
        } : c));
      } else {
        // Created Proxy
        const newRecord = {
          id: Date.now(),
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          notes: formData.notes || null,
          appointmentsCount: 0,
          createdAt: new Date().toISOString()
        };
        setClients([newRecord, ...clients]);
      }
      setIsModalOpen(false);
    } else {
      setMsg("Erro ao salvar dados.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir a ficha deste cliente e todo seu histórico?")) return;
    const res = await deleteClientAction(id);
    if (res.success) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  // Filter
  const filtered = clients.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email && c.email.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wider">BASE DE PACIENTES & CLIENTES</h1>
          <p className="text-slate-400 text-sm mt-1">Gerencie fichas de massoterapia, queixas crônicas, e contate pacientes pelo WhatsApp instantaneamente.</p>
        </div>
        <button
          type="button"
          onClick={handleOpenNew}
          className="px-6 py-3.5 rounded-xl bg-[#006BFF] hover:bg-[#003A7A] text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-[#006BFF]/25 hover:scale-105 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Paciente na Base</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#1F1F1F] flex items-center gap-3 shadow-xl">
        <Search className="w-5 h-5 text-slate-500 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paciente por nome, telefone ou e-mail..."
          className="w-full px-2 py-1.5 bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-slate-500 hover:text-white mr-2 text-xs">Limpar</button>
        )}
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((client) => {
            return (
              <div
                key={client.id}
                className="p-6 rounded-3xl bg-[#141414] border border-[#1F1F1F] hover:border-[#006BFF] transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-13 h-13 rounded-2xl bg-[#0B0B0B] border border-slate-800 flex items-center justify-center font-bebas text-2xl text-[#006BFF] shadow-md group-hover:bg-[#006BFF] group-hover:text-white transition-colors shrink-0">
                        {client.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bebas text-2xl text-white tracking-wide truncate">{client.name}</h3>
                        <span className="text-[11px] font-semibold text-[#00A8FF] block">
                          {client.appointmentsCount} atendimentos realizados
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6 pt-6 border-t border-[#1F1F1F] text-xs text-slate-300">
                    <a
                      href={`https://wa.me/${client.phone}?text=Olá ${encodeURIComponent(client.name)}, aqui é o Crislan Massoterapeuta.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-white text-[#00A8FF] font-medium"
                    >
                      <Phone className="w-4 h-4 text-[#006BFF]" />
                      <span>{client.phone}</span>
                      <ArrowUpRight className="w-3 h-3 ml-auto text-slate-500" />
                    </a>

                    {client.email && (
                      <div className="flex items-center gap-2 text-slate-400 truncate">
                        <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Observações / Queixa card */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-[#0B0B0B] border border-slate-800 space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-500 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[#006BFF]" />
                      <span>Histórico & Queixas</span>
                    </span>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {client.notes || "Nenhuma observação ou queixa crônica registrada."}
                    </p>
                  </div>
                </div>

                {/* Bottom Action bar */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Id Ficha: #{client.id}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(client)}
                      title="Editar Ficha e Observações"
                      className="px-3 py-1.5 rounded-xl bg-[#1F1F1F] hover:bg-[#006BFF] text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(client.id)}
                      title="Excluir Definitivamente"
                      className="p-1.5 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-16 rounded-3xl bg-[#141414] border border-[#1F1F1F] p-8">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h5 className="text-lg font-bold text-white">Nenhum Cliente Encontrado</h5>
            <p className="text-xs text-slate-400 mt-1">Não existem fichas salvas ou nenhum resultado combina com a pesquisa.</p>
          </div>
        )}
      </div>

      {/* Modal / Sidebar Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141414] border border-[#1F1F1F] rounded-3xl p-8 shadow-2xl relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-[#1F1F1F] hover:text-white text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bebas text-3xl tracking-wide text-white mb-6">
              {formData.id ? "EDITAR FICHA DE PACIENTE" : "CADASTRAR NOVO PACIENTE"}
            </h3>

            {msg && (
              <div className="p-3 bg-red-500/10 text-red-400 rounded-xl text-xs mb-4">
                {msg}
              </div>
            )}

            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Rodrigo Pereira"
                  className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-xs focus:border-[#006BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">WhatsApp com DDD *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ex: (11) 98888-7777"
                  className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-xs focus:border-[#006BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">E-mail (Opcional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ex: rodrigo@empresa.com"
                  className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-xs focus:border-[#006BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Ficha Clínica / Queixas / Pressão Desejada</label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Contratura na cervical, prefere pressão forte em liberação miofascial..."
                  className="w-full p-3.5 rounded-xl bg-[#0B0B0B] border border-slate-800 text-white text-xs focus:border-[#006BFF] focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#1F1F1F] text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl bg-[#006BFF] hover:bg-[#003A7A] text-white font-bold text-xs shadow-lg"
                >
                  {submitting ? "Salvando..." : "Salvar Ficha do Paciente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
