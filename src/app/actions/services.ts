"use server";

import { db } from "@/db";
import { services } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getServices() {
  return await db
    .select()
    .from(services)
    .where(eq(services.status, true))
    .orderBy(desc(services.createdAt));
}