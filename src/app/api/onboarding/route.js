import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { role, phone, vehicle_type, license_number } = body;

    // Update user role and phone
    await sql`
      UPDATE auth_users 
      SET role = ${role}, phone = ${phone}
      WHERE id = ${userId}
    `;

    // If rider, create rider profile
    if (role === "rider") {
      await sql`
        INSERT INTO riders_profile (user_id, vehicle_type, license_number)
        VALUES (${userId}, ${vehicle_type || null}, ${license_number || null})
        ON CONFLICT (user_id) DO UPDATE 
        SET vehicle_type = EXCLUDED.vehicle_type, license_number = EXCLUDED.license_number
      `;
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("POST /api/onboarding error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const rows =
      await sql`SELECT role, phone FROM auth_users WHERE id = ${userId}`;
    return Response.json({ user: rows[0] || null });
  } catch (err) {
    console.error("GET /api/onboarding error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
