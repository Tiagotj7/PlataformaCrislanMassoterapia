import { checkAdminAuth, getDashboardSummary, getAdminServices } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/AdminNavbar";
import { DashboardView } from "@/app/admin/DashboardView";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const data = await getDashboardSummary();
  const servicesList = await getAdminServices();

  return (
    <div className="min-h-screen flex flex-col bg-[#070707] text-slate-100 font-sans">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <DashboardView
          initialTodayApps={data.todayApps}
          initialNextApp={data.nextApp}
          totalClients={data.totalClients}
          recentClients={data.recentClients}
          initialWeeklyApps={data.weeklyApps}
          servicesCount={servicesList.length}
        />
      </main>

      <Footer />
    </div>
  );
}
