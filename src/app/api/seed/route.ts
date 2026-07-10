import { initializeDatabase } from "@/db/init";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ status: "success", message: "Database successfully initialized with premium seed data." });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error?.message || "Failed to initialize database" }, { status: 500 });
  }
}
export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json({ status: "success", message: "Database successfully initialized with premium seed data." });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error?.message || "Failed to initialize database" }, { status: 500 });
  }
}
