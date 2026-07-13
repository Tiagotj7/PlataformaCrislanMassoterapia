import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  try {
    const allUsers = await db.select().from(users);

    return Response.json({
      success: true,
      totalUsers: allUsers.length,
      users: allUsers.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
      })),
    });
  } catch (e: any) {
  console.error(e);

  return Response.json(
    {
      success: false,
      message: e.message,
      cause: e.cause,
      stack: e.stack,
    },
    { status: 500 }
  );
}
}
