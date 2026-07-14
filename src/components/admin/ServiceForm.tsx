"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { saveServiceAction } from "@/app/actions/admin";

interface Service {
  id?: number;
  title: string;
  description: string;
  durationMinutes: number;
  price: string;
  image: string;
  category: string;
  status: boolean;
  featured: boolean;
}

interface Props {
  service?: Service;
}

export function ServiceForm({ service }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<Service>({
    id: service?.id,
    title: service?.title ?? "",
    description: service?.description ?? "",
    durationMinutes: service?.durationMinutes ?? 60,
    price: service?.price ?? "0.00",
    image: service?.image ?? "",
    category: service?.category ?? "Esportiva",
    status: service?.status ?? true,
    featured: service?.featured ?? false,
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await saveServiceAction(form);

      if (result.success) {
        router.push("/admin/services");
        router.refresh();
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[#101010] border border-[#1F1F1F] rounded-3xl p-8"
    >
      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Título
        </label>

        <input
          type="text"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Descrição
        </label>

        <textarea
          rows={5}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-slate-300 mb-2">
            Preço
          </label>

          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="w-full bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">
            Duração (min)
          </label>

          <input
            type="number"
            value={form.durationMinutes}
            onChange={(e) =>
              setForm({
                ...form,
                durationMinutes: Number(e.target.value),
              })
            }
            className="w-full bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          URL da Imagem
        </label>

        <input
          type="text"
          value={form.image}
          onChange={(e) =>
            setForm({ ...form, image: e.target.value })
          }
          className="w-full bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Categoria
        </label>

        <input
          type="text"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          className="w-full bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white"
          required
        />
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-3 text-white">
          <input
            type="checkbox"
            checked={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.checked })
            }
          />
          Serviço ativo
        </label>

        <label className="flex items-center gap-3 text-white">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm({ ...form, featured: e.target.checked })
            }
          />
          Destacar na página inicial
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 rounded-xl bg-[#006BFF] hover:bg-[#0053cc] text-white font-semibold disabled:opacity-50"
        >
          {isPending
            ? "Salvando..."
            : service?.id
            ? "Atualizar Serviço"
            : "Cadastrar Serviço"}
        </button>
      </div>
    </form>
  );
}