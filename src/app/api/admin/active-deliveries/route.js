import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { isAdminRole } from "@/app/api/utils/roles";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRows =
      await sql`SELECT role FROM auth_users WHERE id = ${session.user.id}`;
    if (!isAdminRole(userRows[0]?.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const deliveries = await sql`
      SELECT d.*, c.name as customer_name, r.name as rider_name
      FROM deliveries d
      LEFT JOIN auth_users c ON d.customer_id = c.id
      LEFT JOIN auth_users r ON d.rider_id = r.id
      WHERE d.status NOT IN ('Delivered', 'Cancelled')
      ORDER BY d.created_at DESC
      LIMIT 50
    `;

    return Response.json({ deliveries });
  } catch (err) {
    console.error("GET /api/admin/active-deliveries error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
