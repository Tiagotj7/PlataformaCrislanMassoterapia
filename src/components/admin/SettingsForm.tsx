"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";

import { saveSettingsAction } from "@/app/actions/admin";
import { UploadImage } from "./UploadImage";

interface SettingsProps {
  settings: {
    id?: number;

    siteName: string;
    ownerName: string;

    whatsappNumber: string;
    instagramHandle: string;

    address: string;
    googleMapsUrl: string;

    businessHourStart: string;
    businessHourEnd: string;

    lunchHourStart: string;
    lunchHourEnd: string;

    sundaysOpen: boolean;

    autoMessageText: string;

    logo?: string;
    banner?: string;

    primaryColor?: string;
    secondaryColor?: string;

    facebook?: string;
    tiktok?: string;
    youtube?: string;

    metaTitle?: string;
    metaDescription?: string;
  };
}

export function SettingsForm({ settings }: SettingsProps) {
  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState({
    ...settings,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;

      setForm((old) => ({
        ...old,
        [name]: checked,
      }));

      return;
    }

    setForm((old) => ({
      ...old,
      [name]: value,
    }));
  }

  function submit() {
    startTransition(async () => {
      const result = await saveSettingsAction(form);

      if (result.success) {
        alert("Configurações salvas.");
      } else {
        alert("Erro ao salvar.");
      }
    });
  }

  return (
    <div className="space-y-10">

      {/* ===================================== */}
      {/* DADOS DA EMPRESA */}
      {/* ===================================== */}

      <section className="rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] p-6">

        <h2 className="text-2xl font-bold text-white mb-6">
          Dados da Empresa
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="text-sm text-slate-400">
              Nome do Site
            </label>

            <input
              name="siteName"
              value={form.siteName}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] border border-[#272727] px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Proprietário
            </label>

            <input
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] border border-[#272727] px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              WhatsApp
            </label>

            <input
              name="whatsappNumber"
              value={form.whatsappNumber}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] border border-[#272727] px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Instagram
            </label>

            <input
              name="instagramHandle"
              value={form.instagramHandle}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] border border-[#272727] px-4 py-3"
            />
          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* ENDEREÇO */}
      {/* ===================================== */}

      <section className="rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] p-6">

        <h2 className="text-2xl font-bold mb-6">
          Localização
        </h2>

        <div className="space-y-6">

          <div>

            <label className="text-sm text-slate-400">
              Endereço
            </label>

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] border border-[#272727] px-4 py-3"
            />

          </div>

          <div>

            <label className="text-sm text-slate-400">
              Google Maps
            </label>

            <input
              name="googleMapsUrl"
              value={form.googleMapsUrl}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] border border-[#272727] px-4 py-3"
            />

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* HORÁRIOS */}
      {/* ===================================== */}

      <section className="rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] p-6">

        <h2 className="text-2xl font-bold mb-6">
          Horários
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label>Início Atendimento</label>

            <input
              type="time"
              name="businessHourStart"
              value={form.businessHourStart}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] px-4 py-3"
            />

          </div>

          <div>

            <label>Fim Atendimento</label>

            <input
              type="time"
              name="businessHourEnd"
              value={form.businessHourEnd}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] px-4 py-3"
            />

          </div>

          <div>

            <label>Início Almoço</label>

            <input
              type="time"
              name="lunchHourStart"
              value={form.lunchHourStart}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] px-4 py-3"
            />

          </div>

          <div>

            <label>Fim Almoço</label>

            <input
              type="time"
              name="lunchHourEnd"
              value={form.lunchHourEnd}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] px-4 py-3"
            />

          </div>

        </div>

        <div className="mt-6">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.sundaysOpen}
              name="sundaysOpen"
              onChange={handleChange}
            />

            Atendimento aos domingos

          </label>

        </div>

      </section>

            {/* ===================================== */}
      {/* IDENTIDADE VISUAL */}
      {/* ===================================== */}

      <section className="rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] p-6">

        <h2 className="text-2xl font-bold mb-6">
          Identidade Visual
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">

          <UploadImage
            label="Logo"
            value={form.logo || ""}
            onChange={(url) =>
              setForm((old) => ({
                ...old,
                logo: url,
              }))
            }
          />

          <UploadImage
            label="Banner"
            value={form.banner || ""}
            onChange={(url) =>
              setForm((old) => ({
                ...old,
                banner: url,
              }))
            }
          />

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div>

            <label className="text-sm text-slate-400">
              Cor Primária
            </label>

            <input
              type="color"
              name="primaryColor"
              value={form.primaryColor || "#C9A14A"}
              onChange={handleChange}
              className="mt-2 h-14 w-full rounded-xl bg-[#151515]"
            />

          </div>

          <div>

            <label className="text-sm text-slate-400">
              Cor Secundária
            </label>

            <input
              type="color"
              name="secondaryColor"
              value={form.secondaryColor || "#006BFF"}
              onChange={handleChange}
              className="mt-2 h-14 w-full rounded-xl bg-[#151515]"
            />

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* REDES SOCIAIS */}
      {/* ===================================== */}

      <section className="rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] p-6">

        <h2 className="text-2xl font-bold mb-6">
          Redes Sociais
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div>

            <label>Facebook</label>

            <input
              name="facebook"
              value={form.facebook || ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] border border-[#272727] px-4 py-3"
            />

          </div>

          <div>

            <label>TikTok</label>

            <input
              name="tiktok"
              value={form.tiktok || ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] border border-[#272727] px-4 py-3"
            />

          </div>

          <div>

            <label>YouTube</label>

            <input
              name="youtube"
              value={form.youtube || ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] border border-[#272727] px-4 py-3"
            />

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* SEO */}
      {/* ===================================== */}

      <section className="rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] p-6">

        <h2 className="text-2xl font-bold mb-6">
          SEO
        </h2>

        <div className="space-y-6">

          <div>

            <label>Título do Site</label>

            <input
              name="metaTitle"
              value={form.metaTitle || ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] border border-[#272727] px-4 py-3"
            />

          </div>

          <div>

            <label>Meta Description</label>

            <textarea
              rows={5}
              name="metaDescription"
              value={form.metaDescription || ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#151515] border border-[#272727] px-4 py-3"
            />

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* MENSAGEM AUTOMÁTICA */}
      {/* ===================================== */}

      <section className="rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] p-6">

        <h2 className="text-2xl font-bold mb-6">
          Mensagem Automática
        </h2>

        <textarea
          rows={8}
          name="autoMessageText"
          value={form.autoMessageText}
          onChange={handleChange}
          className="w-full rounded-xl bg-[#151515] border border-[#272727] px-5 py-4"
        />

      </section>

      {/* ===================================== */}
      {/* BOTÃO */}
      {/* ===================================== */}

      <div className="flex justify-end">

        <button
          type="button"
          disabled={pending}
          onClick={submit}
          className="bg-[#C9A14A] hover:bg-[#d6af56] transition px-8 py-4 rounded-xl font-bold text-black flex items-center gap-3 disabled:opacity-60"
        >

          <Save size={20} />

          {pending
            ? "Salvando..."
            : "Salvar Configurações"}

        </button>

      </div>

    </div>
  );
}