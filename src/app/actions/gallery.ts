"use server";

import { db } from "@/db";
import { gallery } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Galeria pública (Frontend)
 * Apenas imagens ativas
 */
export async function getGallery() {
  return await db
    .select()
    .from(gallery)
    .where(eq(gallery.status, true))
    .orderBy(desc(gallery.createdAt));
}

/**
 * Painel Admin
 * Lista somente imagens ativas
 */
export async function getAdminGallery() {
  return await db
    .select()
    .from(gallery)
    .where(eq(gallery.status, true))
    .orderBy(desc(gallery.createdAt));
}

/**
 * Lista itens arquivados
 */
export async function getDeletedGallery() {
  return await db
    .select()
    .from(gallery)
    .where(eq(gallery.status, false))
    .orderBy(desc(gallery.createdAt));
}

/**
 * Salvar imagem
 */
export async function saveGalleryAction(data: any) {
  if (data.id) {
    await db
      .update(gallery)
      .set({
        title: data.title,
        imageUrl: data.imageUrl,
        category: data.category,
        status: Boolean(data.status),
      })
      .where(eq(gallery.id, data.id));
  } else {
    await db.insert(gallery).values({
      title: data.title,
      imageUrl: data.imageUrl,
      category: data.category,
      status: true,
    });
  }

  return {
    success: true,
  };
}

/**
 * Excluir (Soft Delete)
 */
export async function deleteGalleryAction(id: number) {
  await db
    .update(gallery)
    .set({
      status: false,
    })
    .where(eq(gallery.id, id));

  return {
    success: true,
  };
}

/**
 * Restaurar
 */
export async function restoreGalleryAction(id: number) {
  await db
    .update(gallery)
    .set({
      status: true,
    })
    .where(eq(gallery.id, id));

  return {
    success: true,
  };
}

/**
 * Buscar por ID
 */
export async function getGalleryById(id: number) {
  const result = await db
    .select()
    .from(gallery)
    .where(eq(gallery.id, id))
    .limit(1);

  return result[0] ?? null;
}