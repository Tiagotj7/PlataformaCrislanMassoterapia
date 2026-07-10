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
    { name: "Galeria & Depoimentos", href: "/admin/content", icon: Image },
    { name: "Configurações", href: "/admin/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#141414] border-b border-[#1F1F1F] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Admin Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group" title="Ver site principal">
              <div className="w-9 h-9 rounded-xl bg-[#006BFF] flex items-center justify-center text-white font-bebas text-lg shadow-md group-hover:scale-105 transition-all">
                CM
              </div>
              <span className="font-bebas text-xl text-white tracking-widest hidden sm:inline group-hover:text-[#00A8FF] transition-colors">CRISLAN ADMIN</span>
            </Link>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
              Gestão POO & Drizzle
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
            {navLinks.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
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
          <div className="flex items-center gap-2">
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
