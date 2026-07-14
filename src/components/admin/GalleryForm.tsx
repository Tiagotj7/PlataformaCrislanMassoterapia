"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { saveGalleryAction } from "@/app/actions/gallery";

interface GalleryData {
  id?: number;
  title: string;
  imageUrl: string;
  category: string;
  status: boolean;
}

interface GalleryFormProps {
  initialData?: GalleryData;
}

export function GalleryForm({ initialData }: GalleryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [category, setCategory] = useState(
    initialData?.category ?? "Atendimento"
  );
  const [status, setStatus] = useState(initialData?.status ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      await saveGalleryAction({
        id: initialData?.id,
        title,
        imageUrl,
        category,
        status,
      });

      router.push("/admin/gallery");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#101010] border border-[#1F1F1F] rounded-3xl p-8 space-y-8"
    >
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Título
        </label>

        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl bg-[#181818] border border-[#2A2A2A] px-4 py-3 text-white focus:outline-none focus:border-[#006BFF]"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-2">
          URL da Imagem
        </label>

        <input
          type="text"
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="/images/foto.jpg"
          className="w-full rounded-xl bg-[#181818] border border-[#2A2A2A] px-4 py-3 text-white focus:outline-none focus:border-[#006BFF]"
        />

        {imageUrl && (
          <div className="mt-5">
            <img
              src={imageUrl}
              alt="Preview"
              className="rounded-xl border border-[#2A2A2A] w-full max-h-80 object-cover"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Categoria
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl bg-[#181818] border border-[#2A2A2A] px-4 py-3 text-white"
        >
          <option value="Atendimento">Atendimento</option>
          <option value="Massagem">Massagem</option>
          <option value="Recuperação">Recuperação</option>
          <option value="Consultório">Consultório</option>
          <option value="Eventos">Eventos</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="status"
          type="checkbox"
          checked={status}
          onChange={(e) => setStatus(e.target.checked)}
          className="w-5 h-5"
        />

        <label htmlFor="status" className="text-white">
          Imagem ativa
        </label>
      </div>

      <div className="flex justify-between pt-6 border-t border-[#1F1F1F]">
        <Link
          href="/admin/gallery"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] text-white transition"
        >
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#006BFF] hover:bg-[#0054CC] text-white transition disabled:opacity-50"
        >
          <Save size={18} />

          {isPending ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}