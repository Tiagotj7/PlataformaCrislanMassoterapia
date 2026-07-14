import { AdminNavbar } from "@/components/AdminNavbar";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-[#070707] px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="font-bebas text-5xl tracking-wider text-white">
              NOVO SERVIÇO
            </h1>

            <p className="text-slate-400 mt-2">
              Cadastre um novo serviço que ficará disponível no site.
            </p>
          </div>

          <ServiceForm />
        </div>
      </main>
    </>
  );
}