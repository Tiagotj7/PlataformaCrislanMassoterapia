"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Pencil,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";

import { deleteGalleryAction } from "@/app/actions/gallery";

interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  status: boolean;
}

interface Props {
  gallery: GalleryItem[];
}

export function GalleryAdmin({ gallery }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "Deseja realmente remover esta imagem da galeria?"
    );

    if (!confirmDelete) return;

    startTransition(async () => {
      await deleteGalleryAction(id);
      router.refresh();
    });
  }

  if (gallery.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#1F1F1F] py-20 text-center">
        <ImageIcon className="mx-auto w-14 h-14 text-slate-500 mb-4" />

        <h2 className="font-bebas text-4xl tracking-wider text-white">
          Nenhuma imagem cadastrada
        </h2>

        <p className="text-slate-500 mt-3">
          Cadastre a primeira imagem da galeria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {gallery.map((item) => (
        <div
          key={item.id}
          className="rounded-3xl overflow-hidden bg-[#101010] border border-[#1F1F1F] hover:border-[#006BFF]/40 transition"
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-56 object-cover"
          />

          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="font-bebas text-3xl tracking-wide text-white">
                  {item.title}
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  {item.category}
                </p>
              </div>

              {item.status && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
            </div>

            <div className="flex justify-between items-center border-t border-[#1F1F1F] pt-5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status
                    ? "bg-green-500/15 text-green-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {item.status ? "Ativa" : "Arquivada"}
              </span>

              <div className="flex gap-2">
                <Link
                  href={`/admin/gallery/${item.id}`}
                  className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525]"
                >
                  <Pencil className="w-4 h-4 text-blue-400" />
                </Link>

                <button
                  disabled={isPending}
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-red-500/20"
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