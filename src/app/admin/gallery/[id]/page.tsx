import { redirect, notFound } from "next/navigation";

import { checkAdminAuth } from "@/app/actions/admin";
import { getGalleryById } from "@/app/actions/gallery";

import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer } from "@/components/Footer";
import { GalleryForm } from "@/components/admin/GalleryForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditGalleryPage({ params }: Props) {
  const isAuth = await checkAdminAuth();

  if (!isAuth) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const gallery = await getGalleryById(Number(id));

  if (!gallery) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070707]">
      <AdminNavbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="mb-10">
          <h1 className="font-bebas text-5xl tracking-wider text-white">
            EDITAR IMAGEM
          </h1>

          <p className="text-slate-400 mt-2">
            Atualize as informações da imagem da galeria.
          </p>
        </div>

        <GalleryForm initialData={gallery} />
      </main>

      <Footer />
    </div>
  );
}