import { redirect } from "next/navigation";

import { checkAdminAuth } from "@/app/actions/admin";
import { getAdminGallery } from "@/app/actions/gallery";

import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer } from "@/components/Footer";
import { GalleryAdmin } from "@/components/admin/GalleryAdmin";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const isAuth = await checkAdminAuth();

  if (!isAuth) {
    redirect("/admin/login");
  }

  const gallery = await getAdminGallery();

  return (
    <div className="min-h-screen flex flex-col bg-[#070707]">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-bebas text-5xl tracking-wider text-white">
              GALERIA
            </h1>

            <p className="text-slate-400 mt-2">
              Gerencie todas as imagens da galeria do site.
            </p>
          </div>
        </div>

        <GalleryAdmin gallery={gallery} />
      </main>

      <Footer />
    </div>
  );
}