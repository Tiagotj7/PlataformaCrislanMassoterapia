"use client";

import { useRef, useState, ChangeEvent } from "react";
import { Upload, ImageIcon, Trash2 } from "lucide-react";

interface UploadImageProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function UploadImage({
  value,
  onChange,
  label = "Imagem",
}: UploadImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(value || "");
  const [loading, setLoading] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar imagem");
      }

      const data = await response.json();

      setPreview(data.url);
      onChange(data.url);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar imagem.");
    } finally {
      setLoading(false);
    }
  }

  function removeImage() {
    setPreview("");
    onChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-300">
        {label}
      </label>

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-[#1F1F1F] bg-[#111]">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-56 object-cover"
          />

          <button
            type="button"
            onClick={removeImage}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 transition rounded-full p-2"
          >
            <Trash2 size={18} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-56 rounded-2xl border-2 border-dashed border-[#2D2D2D] hover:border-[#C9A14A] transition flex flex-col items-center justify-center bg-[#101010]"
        >
          <ImageIcon
            size={50}
            className="text-slate-500 mb-4"
          />

          <span className="text-slate-400">
            Clique para escolher uma imagem
          </span>

          <span className="text-xs text-slate-600 mt-2">
            PNG • JPG • WEBP
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
      />

      {!preview && (
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          className="w-full bg-[#C9A14A] hover:bg-[#d4ae5a] text-black font-semibold rounded-xl py-3 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Upload size={18} />

          {loading ? "Enviando..." : "Selecionar imagem"}
        </button>
      )}
    </div>
  );
}