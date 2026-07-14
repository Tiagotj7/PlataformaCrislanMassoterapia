"use server";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkAdminAuth } from "./admin";

export async function getSettings() {
  const config = await db.select().from(settings).limit(1);

  if (config.length === 0) {
    return null;
  }

  return config[0];
}

export async function saveSettings(data: {
  siteName: string;
  ownerName: string;
  whatsappNumber: string;
  instagramHandle: string;
  address: string;
  googleMapsUrl: string;
  businessHourStart: string;
  businessHourEnd: string;
  lunchHourStart: string;
  lunchHourEnd: string;
  sundaysOpen: boolean;
  autoMessageText: string;
}) {
  const authenticated = await checkAdminAuth();

  if (!authenticated) {
    throw new Error("Unauthorized");
  }

  const current = await db
    .select()
    .from(settings)
    .limit(1);

  if (current.length === 0) {
    await db.insert(settings).values({
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
      sundaysOpen: data.sundaysOpen,
      autoMessageText: data.autoMessageText,
      updatedAt: new Date(),
    });

    return {
      success: true,
      message: "Configurações criadas com sucesso.",
    };
  }

  await db
    .update(settings)
    .set({
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
      sundaysOpen: data.sundaysOpen,
      autoMessageText: data.autoMessageText,
      updatedAt: new Date(),
    })
    .where(eq(settings.id, current[0].id));

  return {
    success: true,
    message: "Configurações salvas com sucesso.",
  };
}

export async function resetSettings() {
  const authenticated = await checkAdminAuth();

  if (!authenticated) {
    throw new Error("Unauthorized");
  }

  const current = await db
    .select()
    .from(settings)
    .limit(1);

  if (current.length === 0) {
    return {
      success: false,
      message: "Nenhuma configuração encontrada.",
    };
  }

  await db
    .update(settings)
    .set({
      siteName: "Crislan Massoterapeuta",
      ownerName: "Crislan",
      whatsappNumber: "5575981482035",
      instagramHandle: "crislanmassoterapeuta",
      address:
        "Rua das Olimpíadas, 200 - Vila Olímpia, São Paulo - SP",
      googleMapsUrl: "https://maps.google.com",
      businessHourStart: "08:00",
      businessHourEnd: "19:00",
      lunchHourStart: "12:00",
      lunchHourEnd: "13:30",
      sundaysOpen: false,
      autoMessageText:
        "Olá! Seu agendamento com Crislan Massoterapeuta foi recebido com sucesso. Nos vemos no horário marcado!",
      updatedAt: new Date(),
    })
    .where(eq(settings.id, current[0].id));

  return {
    success: true,
    message: "Configurações restauradas.",
  };
}