"use server";

import { db } from "@/db";
import { services } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getServices() {
  return await db
    .select()
    .from(services)
    .orderBy(desc(services.createdAt));
}