"use server";

import { db } from "@/db";
import { services, settings, appointments, clients, blockedDates, blockedHours, testimonials, gallery, logs, users } from "@/db/schema";
import { eq, desc, and, ilike, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/password";

const ADMIN_COOKIE_NAME = "crislan_admin_session";

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === "authenticated_admin";
}

export async function loginAdmin(email: string, passwordString: string) {
  try {
    const userList = await db.select().from(users).where(eq(users.email, email));
    if (userList.length === 0) {
      return { success: false, message: "E-mail ou senha incorretos." };
    }
    const adminUser = userList[0];
    
    if (!(await verifyPassword(passwordString, adminUser.passwordHash))) {
      return { success: false, message: "E-mail ou senha incorretos." };
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, "authenticated_admin", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    await db.insert(logs).values({
      action: "ADMIN_LOGIN",
      details: `Administrador ${adminUser.name} fez login no sistema.`
    });

    return { success: true };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Erro no servidor ao autenticar." };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return { success: true };
}

export async function getDashboardSummary() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  const todayStr = new Date().toISOString().split("T")[0];

  // Appointments today
  const todayApps = await db.select().from(appointments)
    .where(eq(appointments.appointmentDate, todayStr))
    .orderBy(appointments.appointmentTime);

  // Next appointment
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const nextApp = todayApps.find(app => {
    if (app.status !== "confirmed") return false;
    const parts = app.appointmentTime.split(":").map(Number);
    const appMin = parts[0] * 60 + parts[1];
    return appMin >= currentMin;
  }) || todayApps[0] || null;

  // Total clients
  const totalClientsRes = await db.select({ count: sql<number>`count(*)` }).from(clients);
  const totalClients = Number(totalClientsRes[0]?.count || 0);

  // Recent clients
  const recentClients = await db.select().from(clients).orderBy(desc(clients.createdAt)).limit(5);

  // Weekly agenda summary (appointments from today to 7 days ahead)
  const nextWeekObj = new Date();
  nextWeekObj.setDate(nextWeekObj.getDate() + 7);
  const nextWeekStr = nextWeekObj.toISOString().split("T")[0];

  const weeklyApps = await db.select().from(appointments)
    .where(
      and(
        sql`${appointments.appointmentDate} >= ${todayStr}`,
        sql`${appointments.appointmentDate} <= ${nextWeekStr}`
      )
    )
    .orderBy(appointments.appointmentDate, appointments.appointmentTime);

  return {
    todayApps,
    nextApp,
    totalClients,
    recentClients,
    weeklyApps,
  };
}

export async function getAdminAppointments(filter?: { status?: string; search?: string }) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  let query = db.select().from(appointments).orderBy(desc(appointments.appointmentDate), appointments.appointmentTime);
  const list = await query;

  return list.filter(app => {
    if (filter?.status && filter.status !== "all" && app.status !== filter.status) return false;
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      const matchName = app.clientName.toLowerCase().includes(q);
      const matchPhone = app.clientPhone.toLowerCase().includes(q);
      if (!matchName && !matchPhone) return false;
    }
    return true;
  });
}

export async function updateAppointmentStatus(id: number, status: string) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  await db.update(appointments).set({ status }).where(eq(appointments.id, id));
  
  await db.insert(logs).values({
    action: "STATUS_AGENDAMENTO",
    details: `Agendamento #${id} atualizado para status '${status}'.`
  });

  return { success: true };
}

export async function deleteAppointmentAction(id: number) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  await db.delete(appointments).where(eq(appointments.id, id));
  return { success: true };
}

// Services Actions
export async function getAdminServices() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");
  return await db.select().from(services).orderBy(services.title);
}

export async function saveServiceAction(data: any) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  if (data.id) {
    await db.update(services).set({
      title: data.title,
      description: data.description,
      durationMinutes: Number(data.durationMinutes),
      price: data.price,
      image: data.image,
      category: data.category,
      status: Boolean(data.status),
      featured: Boolean(data.featured)
    }).where(eq(services.id, data.id));
  } else {
    // Generate slug
    const slug = data.title.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
    await db.insert(services).values({
      title: data.title,
      slug,
      description: data.description,
      durationMinutes: Number(data.durationMinutes),
      price: data.price,
      image: data.image,
      category: data.category,
      status: Boolean(data.status),
      featured: Boolean(data.featured)
    });
  }
  return { success: true };
}

export async function deleteServiceAction(id: number) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  await db.delete(services).where(eq(services.id, id));
  return { success: true };
}

// Clients Actions
export async function getAdminClients(search?: string) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  const list = await db.select().from(clients).orderBy(desc(clients.appointmentsCount), clients.name);
  if (!search) return list;
  const q = search.toLowerCase();
  return list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
}

export async function saveClientAction(data: any) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  if (data.id) {
    await db.update(clients).set({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      notes: data.notes || ""
    }).where(eq(clients.id, data.id));
  } else {
    await db.insert(clients).values({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      notes: data.notes || "",
      appointmentsCount: 0
    });
  }
  return { success: true };
}

export async function deleteClientAction(id: number) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  await db.delete(clients).where(eq(clients.id, id));
  return { success: true };
}

// Settings Actions
export async function getAdminSettings() {
  const res = await db.select().from(settings).limit(1);
  return res[0] || null;
}

export async function saveSettingsAction(data: any) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  const exist = await db.select().from(settings).limit(1);
  if (exist.length > 0) {
    await db.update(settings).set({
      siteName: data.siteName,
      ownerName: data.ownerName,
      whatsappNumber: data.whatsappNumber,
      instagramHandle: data.instagramHandle,
      address: data.address,
      googleMapsUrl: data.googleMapsUrl,
      businessHourStart: data.businessHourStart,
      businessHourEnd: data.businessHourEnd,
      lunchHourStart: data.lunchHourStart,
      lunchHourEnd: data.lunchHourEnd,
      sundaysOpen: Boolean(data.sundaysOpen),
      autoMessageText: data.autoMessageText,
      updatedAt: new Date()
    }).where(eq(settings.id, exist[0].id));
  } else {
    await db.insert(settings).values(data);
  }
  return { success: true };
}

// Blocked Dates and Hours Actions
export async function getAdminBlocks() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  const bDates = await db.select().from(blockedDates).orderBy(desc(blockedDates.blockedDate));
  const bHours = await db.select().from(blockedHours).orderBy(blockedHours.hour);

  return { blockedDates: bDates, blockedHours: bHours };
}

export async function addBlockedDateAction(blockedDate: string, reason: string) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  await db.insert(blockedDates).values({ blockedDate, reason });
  return { success: true };
}

export async function deleteBlockedDateAction(id: number) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  await db.delete(blockedDates).where(eq(blockedDates.id, id));
  return { success: true };
}

export async function addBlockedHourAction(hour: string, reason: string, specificDate?: string) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  await db.insert(blockedHours).values({
    hour,
    reason: reason || "Bloqueio manual",
    specificDate: specificDate || null
  });
  return { success: true };
}

export async function deleteBlockedHourAction(id: number) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  await db.delete(blockedHours).where(eq(blockedHours.id, id));
  return { success: true };
}

// Testimonials Action
export async function getAdminTestimonials() {
  return await db.select().from(testimonials).orderBy(desc(testimonials.id));
}

export async function saveTestimonialAction(data: any) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  if (data.id) {
    await db.update(testimonials).set({
      clientName: data.clientName,
      roleOrSport: data.roleOrSport,
      content: data.content,
      rating: Number(data.rating || 5),
      active: Boolean(data.active)
    }).where(eq(testimonials.id, data.id));
  } else {
    await db.insert(testimonials).values({
      clientName: data.clientName,
      roleOrSport: data.roleOrSport,
      content: data.content,
      rating: Number(data.rating || 5),
      active: Boolean(data.active)
    });
  }
  return { success: true };
}

export async function deleteTestimonialAction(id: number) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  await db.delete(testimonials).where(eq(testimonials.id, id));
  return { success: true };
}

// Gallery Action
export async function getAdminGallery() {
  return await db.select().from(gallery).orderBy(desc(gallery.id));
}

export async function saveGalleryAction(data: any) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  if (data.id) {
    await db.update(gallery).set({
      title: data.title,
      imageUrl: data.imageUrl,
      category: data.category,
      active: Boolean(data.active)
    }).where(eq(gallery.id, data.id));
  } else {
    await db.insert(gallery).values({
      title: data.title,
      imageUrl: data.imageUrl,
      category: data.category,
      active: Boolean(data.active)
    });
  }
  return { success: true };
}

export async function deleteGalleryAction(id: number) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) throw new Error("Unauthorized");

  await db.delete(gallery).where(eq(gallery.id, id));
  return { success: true };
}
