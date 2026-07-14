import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { services } from "@/db/schema";

import { AdminNavbar } from "@/components/AdminNavbar";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { checkAdminAuth } from "@/app/actions/admin";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage({ params }: Props) {
  const isAuth = await checkAdminAuth();

  if (!isAuth) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const result = await db
    .select()
    .from(services)
    .where(eq(services.id, Number(id)))
    .limit(1);

  const service = result[0];

  if (!service) {
    redirect("/admin/services");
  }

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-[#070707] px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="font-bebas text-5xl tracking-wider text-white">
              EDITAR SERVIÇO
            </h1>

            <p className="text-slate-400 mt-2">
              Atualize as informações do serviço.
            </p>
          </div>

          <ServiceForm service={service} />
        </div>
      </main>
    </>
  );
}