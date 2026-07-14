"use server";

import { db } from "@/db";
import { services, settings, appointments, clients, blockedDates, blockedHours, testimonials, gallery, logs } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

function normalizeImageUrl(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;

  const normalized = String(value).trim();
  if (!normalized) return fallback;

  if (normalized.includes("logocrislanmassagem")) return "/images/logocrislanmassagem.jpeg";
  if (normalized.includes("crislamassage2")) return "/images/crislamassage2.jpeg";
  return normalized;
}

const fallbackServices = [
  {
    id: 1,
    title: "Massoterapia Desportiva",
    slug: "massoterapia-desportiva",
    description: "Focada em atletas e praticantes de atividade física. Auxilia na liberação de ácido lático, alivia fadiga muscular pós-treino e melhora a flexibilidade para prevenir lesões.",
    durationMinutes: 60,
    price: "180.00",
    image: "/images/logocrislanmassagem.jpeg",
    category: "Desportiva",
    status: true,
    featured: true,
  },
  {
    id: 2,
    title: "Liberação Miofascial (IASTM)",
    slug: "liberacao-miofascial",
    description: "Técnica manual e instrumental para soltar a fáscia muscular. Desfaz pontos de gatilho, restaura a mobilidade das articulações e elimina dores crônicas.",
    durationMinutes: 60,
    price: "190.00",
    image: "/images/crislamassage2.jpeg",
    category: "Miofascial",
    status: true,
    featured: true,
  },
];

const fallbackSettings = {
  siteName: "Crislan Massoterapeuta",
  ownerName: "Crislan",
  whatsappNumber: "5575981482035",
  instagramHandle: "crislanmassoterapeuta",
  address: "Rua das Olimpíadas, 200 - Vila Olímpia, São Paulo - SP",
  googleMapsUrl: "https://maps.google.com",
  businessHourStart: "08:00",
  businessHourEnd: "20:00",
  lunchHourStart: "12:00",
  lunchHourEnd: "13:30",
  sundaysOpen: false,
  autoMessageText: "Olá! Seu agendamento com Crislan Massoterapeuta foi recebido com sucesso.",
};

export async function getServices() {
  try {
    const activeStatusCondition = sql`
      COALESCE(${services.status}::text, '') IN ('true', '1', 't', 'yes', 'y')
    `;

    const list = await db.select().from(services).where(activeStatusCondition);
    const normalizedList = list.map((item) => ({
      ...item,
      image: normalizeImageUrl(item.image, "/images/logocrislanmassagem.jpeg"),
    }));
    // Sort featured first
    return normalizedList.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  } catch (err) {
    console.error("Error fetching services:", err);
    return fallbackServices;
  }
}

export async function getPublicSettings() {
  try {
    const res = await db.select().from(settings).limit(1);
    return res[0] || null;
  } catch (err) {
    console.error("Error fetching settings:", err);
    return fallbackSettings as any;
  }
}

export async function getPublicGallery() {
  try {
    const list = await db.select().from(gallery).where(eq(gallery.active, true));
    return list.map((item) => ({
      ...item,
      imageUrl: normalizeImageUrl(item.imageUrl, "/images/logocrislanmassagem.jpeg"),
    }));
  } catch (err) {
    console.error("Error fetching gallery:", err);
    return [];
  }
}

export async function getPublicTestimonials() {
  try {
    return await db.select().from(testimonials).where(eq(testimonials.active, true));
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    return [];
  }
}

export async function getAvailableTimeSlots(dateString: string, serviceDurationMinutes: number = 60): Promise<{ available: boolean; reason?: string; slots: string[] }> {
  try {
    const currentSettings = await getPublicSettings();
    if (!currentSettings) {
      return { available: false, reason: "Configurações indisponíveis", slots: [] };
    }

    // Check past dates
    const requestedDate = new Date(dateString + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      return { available: false, reason: "Não é possível agendar em datas passadas", slots: [] };
    }

    // Check Sunday
    const dayOfWeek = requestedDate.getDay(); // 0 = Sunday
    if (dayOfWeek === 0 && !currentSettings.sundaysOpen) {
      return { available: false, reason: "Não há expediente aos domingos", slots: [] };
    }

    // Check Blocked Dates
    const blockedDateCheck = await db.select().from(blockedDates).where(eq(blockedDates.blockedDate, dateString));
    if (blockedDateCheck.length > 0) {
      return { available: false, reason: blockedDateCheck[0].reason || "Data bloqueada para atendimentos", slots: [] };
    }

    // Fetch confirmed appointments for this date
    const dayAppointments = await db.select().from(appointments).where(
      and(
        eq(appointments.appointmentDate, dateString),
        eq(appointments.status, "confirmed")
      )
    );

    // Fetch blocked hours
    const bHours = await db.select().from(blockedHours);
    const applicableBlockedHours = bHours.filter(bh => !bh.specificDate || bh.specificDate === dateString).map(bh => bh.hour);

    // Parse business hours
    const startParts = currentSettings.businessHourStart.split(":").map(Number);
    const endParts = currentSettings.businessHourEnd.split(":").map(Number);
    const startMinutes = startParts[0] * 60 + startParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];

    // Parse lunch break
    const lunchStartParts = currentSettings.lunchHourStart.split(":").map(Number);
    const lunchEndParts = currentSettings.lunchHourEnd.split(":").map(Number);
    const lunchStartMinutes = lunchStartParts[0] * 60 + lunchStartParts[1];
    const lunchEndMinutes = lunchEndParts[0] * 60 + lunchEndParts[1];

    const slots: string[] = [];

    // Generate intervals (every 60 minutes or 45 minutes)
    // To be very accommodating, let's generate slots every 60 minutes starting at businessHourStart
    for (let currentMinute = startMinutes; currentMinute + serviceDurationMinutes <= endMinutes; currentMinute += 60) {
      const slotHour = Math.floor(currentMinute / 60);
      const slotMin = currentMinute % 60;
      const slotString = `${String(slotHour).padStart(2, "0")}:${String(slotMin).padStart(2, "0")}`;

      // Check if slot overlaps with lunch break
      const slotEndMinute = currentMinute + serviceDurationMinutes;
      const overlapsWithLunch = (currentMinute < lunchEndMinutes && slotEndMinute > lunchStartMinutes);
      if (overlapsWithLunch) continue;

      // Check if slot is in blockedHours
      if (applicableBlockedHours.includes(slotString)) continue;

      // Check if slot overlaps with any confirmed appointment
      const overlapsWithAppointment = dayAppointments.some(app => {
        const appParts = app.appointmentTime.split(":").map(Number);
        const appStartMinute = appParts[0] * 60 + appParts[1];
        const appEndMinute = appStartMinute + app.durationMinutes;

        // Two intervals overlap if (StartA < EndB) and (EndA > StartB)
        return (currentMinute < appEndMinute && slotEndMinute > appStartMinute);
      });

      if (!overlapsWithAppointment) {
        // If the date is exactly today, make sure the time slot is at least 60 mins in the future
        if (dateString === new Date().toISOString().split("T")[0]) {
          const now = new Date();
          const currentNowMinutes = now.getHours() * 60 + now.getMinutes();
          if (currentMinute <= currentNowMinutes + 60) {
            continue; // Skip slots that are too soon
          }
        }

        slots.push(slotString);
      }
    }

    if (slots.length === 0) {
      return { available: false, reason: "Todos os horários estão preenchidos ou indisponíveis neste dia", slots: [] };
    }

    return { available: true, slots };
  } catch (err) {
    console.error("Error computing available slots:", err);
    return { available: false, reason: "Erro ao verificar horários", slots: [] };
  }
}

export async function createAppointment(data: {
  serviceId: number;
  appointmentDate: string;
  appointmentTime: string;
  careType: string;
  clientName: string;
  clientPhone: string;
  observations?: string;
}) {
  try {
    // 1. Fetch Service
    const servs = await db.select().from(services).where(eq(services.id, data.serviceId));
    if (servs.length === 0) {
      return { success: false, message: "Serviço não encontrado" };
    }
    const service = servs[0];

    // 2. Double check time slot availability
    const slotCheck = await getAvailableTimeSlots(data.appointmentDate, service.durationMinutes);
    if (!slotCheck.available || !slotCheck.slots.includes(data.appointmentTime)) {
      return { success: false, message: "Este horário não está mais disponível. Por favor, escolha outro." };
    }

    // 3. Find or Create Client
    let clientRecord: any;
    const existingClient = await db.select()
.from(clients)
.where(eq(clients.status, true)).where(eq(clients.phone, data.clientPhone));

    if (existingClient.length > 0) {
      clientRecord = existingClient[0];
      // Increment count
      await db.update(clients).set({
        name: data.clientName, // update name if changed
        appointmentsCount: clientRecord.appointmentsCount + 1
      }).where(eq(clients.id, clientRecord.id));
    } else {
      const newClients = await db.insert(clients).values({
        name: data.clientName,
        phone: data.clientPhone,
        notes: data.observations ? `Primeira observação: ${data.observations}` : "",
        appointmentsCount: 1
      }).returning();
      clientRecord = newClients[0];
    }

    // 4. Insert Appointment
    const newApps = await db.insert(appointments).values({
      clientId: clientRecord.id,
      serviceId: service.id,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      durationMinutes: service.durationMinutes,
      careType: data.careType,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      observations: data.observations || "",
      price: service.price,
      status: "confirmed"
    }).returning();

    // 5. Log action
    await db.insert(logs).values({
      action: "NOVO_AGENDAMENTO",
      details: `Cliente ${data.clientName} agendou ${service.title} para ${data.appointmentDate} às ${data.appointmentTime}.`
    });

    const currentSettings = await getPublicSettings();

    return {
      success: true,
      appointment: newApps[0],
      serviceTitle: service.title,
      whatsappNumber: currentSettings?.whatsappNumber || "5511999999999",
      autoMessage: currentSettings?.autoMessageText || "Olá! Agendamento recebido com sucesso."
    };
  } catch (err) {
    console.error("Error creating appointment:", err);
    return { success: false, message: "Ocorreu um erro ao registrar seu agendamento. Tente novamente." };
  }
}
