import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { isAdminRole } from "@/app/api/utils/roles";

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRows =
      await sql`SELECT role FROM auth_users WHERE id = ${userId}`;
    if (!isAdminRole(userRows[0]?.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { status = null, admin_reply = null } = body;

    const result = await sql`
      UPDATE customer_messages
      SET
        status = COALESCE(${status}, status),
        admin_reply = COALESCE(${admin_reply}, admin_reply),
        replied_by = CASE WHEN ${admin_reply}::text IS NOT NULL THEN ${userId} ELSE replied_by END,
        replied_at = CASE WHEN ${admin_reply}::text IS NOT NULL THEN now() ELSE replied_at END
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }

    return Response.json({ message: result[0] });
  } catch (err) {
    console.error("PUT /api/admin/messages/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
