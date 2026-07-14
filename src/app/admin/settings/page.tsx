import { redirect } from "next/navigation";

import { checkAdminAuth, getAdminSettings } from "@/app/actions/admin";

import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer } from "@/components/Footer";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const isAuth = await checkAdminAuth();

  if (!isAuth) {
    redirect("/admin/login");
  }

  const settings = await getAdminSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#070707] text-white">
      <AdminNavbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <div className="mb-10">
          <h1 className="font-bebas text-5xl tracking-wider">
            CONFIGURAÇÕES
          </h1>

          <p className="text-slate-400 mt-2">
            Gerencie as informações gerais do sistema.
          </p>
        </div>

        <div className="rounded-3xl border border-[#1F1F1F] bg-[#101010] p-8">
          <SettingsForm settings={settings} />
        </div>
      </main>

      <Footer />
    </div>
  );
}