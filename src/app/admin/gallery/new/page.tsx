import { redirect } from "next/navigation";

import { checkAdminAuth } from "@/app/actions/admin";

import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer } from "@/components/Footer";
import { GalleryForm } from "@/components/admin/GalleryForm";

export default async function NewGalleryPage() {
  const isAuth = await checkAdminAuth();

  if (!isAuth) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070707]">
      <AdminNavbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="mb-10">
          <h1 className="font-bebas text-5xl tracking-wider text-white">
            NOVA IMAGEM
          </h1>

          <p className="text-slate-400 mt-2">
            Adicione uma nova imagem à galeria do site.
          </p>
        </div>

        <GalleryForm />
      </main>

      <Footer />
    </div>
  );
}