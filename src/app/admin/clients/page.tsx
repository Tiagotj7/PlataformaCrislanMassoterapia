import { checkAdminAuth, getAdminClients } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/AdminNavbar";
import { ClientsManager } from "@/app/admin/clients/ClientsManager";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) redirect("/admin/login");

  const list = await getAdminClients();

  return (
    <div className="min-h-screen flex flex-col bg-[#070707] text-slate-100 font-sans">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <ClientsManager initialClients={list} />
      </main>

      <Footer />
    </div>
  );
}
