import { AdminNavbar } from "@/components/AdminNavbar";
import { Plus } from "lucide-react";
import Link from "next/link";

import { ServicesAdmin } from "@/components/admin/ServicesAdmin";
import { getServices } from "@/app/actions/services";

export default async function AdminServicesPage() {

  const servicesList = await getServices();

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-[#070707] px-8 py-10">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-bebas text-5xl tracking-wider text-white">
                Serviços
              </h1>

              <p className="text-slate-400 mt-2">
                Gerencie todos os serviços exibidos no site.
              </p>
            </div>

            <Link
              href="/admin/services/new"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#006BFF] hover:bg-[#0053cc] text-white font-semibold transition"
            >
              <Plus className="w-5 h-5" />
              Novo Serviço
            </Link>
          </div>

          <ServicesAdmin services={servicesList} />

        </div>
      </main>
    </>
  );
}