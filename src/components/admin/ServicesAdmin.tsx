"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Clock,
  Star,
  Pencil,
  Trash2,
} from "lucide-react";

import { deleteServiceAction } from "@/app/actions/admin";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string | number;
  durationMinutes: number;
  featured: boolean;
  status: boolean;
}

interface Props {
  services: Service[];
}

export function ServicesAdmin({ services }: Props) {
  const router = useRouter();

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm(
      "Deseja realmente excluir este serviço?"
    );

    if (!confirmDelete) return;

    try {
      const result = await deleteServiceAction(id);

      if (result.success) {
        router.refresh();
      } else {
        alert("Não foi possível excluir o serviço.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir serviço.");
    }
  }

  if (services.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#1F1F1F] py-20 text-center">
        <h2 className="font-bebas text-4xl tracking-wider text-white">
          Nenhum serviço cadastrado
        </h2>

        <p className="text-slate-500 mt-3">
          Cadastre seu primeiro serviço para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {services.map((service) => (
        <div
          key={service.id}
          className="rounded-3xl overflow-hidden border border-[#1F1F1F] bg-[#101010] hover:border-[#006BFF]/40 transition-all duration-300"
        >
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-52 object-cover"
          />

          <div className="p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="font-bebas text-3xl tracking-wide text-white leading-none">
                {service.title}
              </h2>

              {service.featured && (
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 shrink-0" />
              )}
            </div>

            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
              {service.description}
            </p>

            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-bold text-[#00A8FF]">
                R$ {Number(service.price).toFixed(2)}
              </span>

              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Clock className="w-4 h-4" />
                {service.durationMinutes} min
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#1F1F1F] pt-5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  service.status
                    ? "bg-green-500/15 text-green-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {service.status ? "Ativo" : "Inativo"}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/services/${service.id}`}
                  className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] transition"
                >
                  <Pencil className="w-4 h-4 text-blue-400" />
                </Link>

                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-red-500/20 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}