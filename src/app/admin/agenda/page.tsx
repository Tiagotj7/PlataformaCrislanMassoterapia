import { checkAdminAuth, getAdminAppointments, getAdminServices, getAdminClients, getAdminBlocks } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/AdminNavbar";
import { AgendaManager } from "@/app/admin/agenda/AgendaManager";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function AdminAgendaPage() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) redirect("/admin/login");

  const apps = await getAdminAppointments();
  const servs = await getAdminServices();
  const clis = await getAdminClients();
  const blocks = await getAdminBlocks();

  return (
    <div className="min-h-screen flex flex-col bg-[#070707] text-slate-100 font-sans">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <AgendaManager
          initialAppointments={apps}
          initialBlockedDates={blocks.blockedDates}
          initialBlockedHours={blocks.blockedHours}
          servicesList={servs}
          clientsList={clis}
        />
      </main>

      <Footer />
    </div>
  );
}
