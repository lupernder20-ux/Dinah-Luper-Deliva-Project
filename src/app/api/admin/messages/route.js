import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { isAdminRole } from "@/app/api/utils/roles";

export async function GET(request) {
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

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const type = url.searchParams.get("type");

    let messages;
    if (status && type) {
      messages = await sql`
        SELECT m.*, u.name as customer_name, u.email as customer_email, d.tracking_id
        FROM customer_messages m
        LEFT JOIN auth_users u ON m.customer_id = u.id
        LEFT JOIN deliveries d ON m.delivery_id = d.id
        WHERE m.status = ${status} AND m.type = ${type}
        ORDER BY m.created_at DESC LIMIT 100
      `;
    } else if (status) {
      messages = await sql`
        SELECT m.*, u.name as customer_name, u.email as customer_email, d.tracking_id
        FROM customer_messages m
        LEFT JOIN auth_users u ON m.customer_id = u.id
        LEFT JOIN deliveries d ON m.delivery_id = d.id
        WHERE m.status = ${status}
        ORDER BY m.created_at DESC LIMIT 100
      `;
    } else if (type) {
      messages = await sql`
        SELECT m.*, u.name as customer_name, u.email as customer_email, d.tracking_id
        FROM customer_messages m
        LEFT JOIN auth_users u ON m.customer_id = u.id
        LEFT JOIN deliveries d ON m.delivery_id = d.id
        WHERE m.type = ${type}
        ORDER BY m.created_at DESC LIMIT 100
      `;
    } else {
      messages = await sql`
        SELECT m.*, u.name as customer_name, u.email as customer_email, d.tracking_id
        FROM customer_messages m
        LEFT JOIN auth_users u ON m.customer_id = u.id
        LEFT JOIN deliveries d ON m.delivery_id = d.id
        ORDER BY m.created_at DESC LIMIT 100
      `;
    }

    return Response.json({ messages });
  } catch (err) {
    console.error("GET /api/admin/messages error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
