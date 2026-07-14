"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/app/actions/admin";
import { LayoutDashboard, Calendar, Users, Briefcase, Settings, Image, LogOut, ShieldCheck, Home } from "lucide-react";

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Agenda Oficial", href: "/admin/agenda", icon: Calendar },
    { name: "Clientes", href: "/admin/clients", icon: Users },
    { name: "Serviços", href: "/admin/services", icon: Briefcase },
    { name: "Galeria", href: "/admin/gallery", icon: Image },
    { name: "Configurações", href: "/admin/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#1F1F1F] bg-[#0B0B0B]/90 backdrop-blur-xl shadow-xl shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          
<div className="flex items-center pr-10 mr-10 border-r border-[#1F1F1F] shrink-0">

  <Link
    href="/"
    className="group flex items-center gap-4"
    title="Visualizar site"
  >

    <div className="hidden lg:flex flex-col leading-none">

      <span className="font-bebas text-2xl tracking-[0.2em] text-white">
        CRISLAN
      </span>

      <span className="uppercase text-[10px] tracking-[0.4em] text-[#00A8FF]">
        Painel Administrativo
      </span>

    </div>

  </Link>

  <div className="hidden xl:block w-px h-10" />

</div>
          {/* Nav items */}
         <nav className="flex items-center gap-2 mx-auto">
            {navLinks.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#006BFF] text-white shadow-md shadow-[#006BFF]/25"
                      : "text-slate-400 hover:text-white hover:bg-[#1F1F1F]"
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* External links and Logout */}
          <div className="flex items-center gap-3 ml-10 pl-8 border-l border-[#1F1F1F] shrink-0">
            <Link
              href="/"
              target="_blank"
              title="Visualizar o Site Público"
              className="p-2 rounded-xl bg-[#1F1F1F] hover:bg-[#2A2A2A] text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
            >
              <Home className="w-4 h-4" />
              <span className="hidden lg:inline font-medium">Ver Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              title="Sair do Sistema"
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-xs font-medium ml-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline font-semibold">Sair</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
