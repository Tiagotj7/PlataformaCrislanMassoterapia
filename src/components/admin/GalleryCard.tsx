"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Pencil,
  Trash2,
  RotateCcw,
  Image as ImageIcon,
} from "lucide-react";

import {
  deleteGalleryAction,
  restoreGalleryAction,
} from "@/app/actions/gallery";

interface GalleryCardProps {
  gallery: {
    id: number;
    title: string;
    imageUrl: string;
    category: string;
    status: boolean;
  };
}

export function GalleryCard({ gallery }: GalleryCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Deseja arquivar esta imagem?")) return;

    startTransition(async () => {
      await deleteGalleryAction(gallery.id);
      router.refresh();
    });
  }

  function handleRestore() {
    startTransition(async () => {
      await restoreGalleryAction(gallery.id);
      router.refresh();
    });
  }

  return (
    <div className="rounded-3xl overflow-hidden bg-[#101010] border border-[#1F1F1F] hover:border-[#006BFF]/40 transition-all duration-300">
      <div className="relative">
        <img
          src={gallery.imageUrl}
          alt={gallery.title}
          className="w-full h-56 object-cover"
        />

        {!gallery.status && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold">
              ARQUIVADA
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-bebas text-3xl tracking-wide text-white">
              {gallery.title}
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              {gallery.category}
            </p>
          </div>

          <ImageIcon className="text-[#00A8FF]" size={22} />
        </div>

        <div className="flex items-center justify-between border-t border-[#1F1F1F] pt-5">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              gallery.status
                ? "bg-green-500/15 text-green-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {gallery.status ? "Ativa" : "Arquivada"}
          </span>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/gallery/${gallery.id}`}
              className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] transition"
            >
              <Pencil
                className="text-blue-400"
                size={18}
              />
            </Link>

            {gallery.status ? (
              <button
                disabled={isPending}
                onClick={handleDelete}
                className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-red-500/20 transition"
              >
                <Trash2
                  className="text-red-400"
                  size={18}
                />
              </button>
            ) : (
              <button
                disabled={isPending}
                onClick={handleRestore}
                className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-green-500/20 transition"
              >
                <RotateCcw
                  className="text-green-400"
                  size={18}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}