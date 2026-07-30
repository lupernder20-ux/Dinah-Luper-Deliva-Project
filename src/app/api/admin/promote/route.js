import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { isSuperAdminRole } from "@/app/api/utils/roles";

const VALID_ROLES = ["customer", "rider", "admin", "super_admin"];

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const callerRows =
      await sql`SELECT role FROM auth_users WHERE id = ${session.user.id}`;
    if (!isSuperAdminRole(callerRows[0]?.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, role } = await request.json();
    if (!email || !VALID_ROLES.includes(role)) {
      return Response.json({ error: "Invalid email or role" }, { status: 400 });
    }

    const result = await sql`
      UPDATE auth_users SET role = ${role} WHERE email = ${email}
      RETURNING id, name, email, role
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "No account found with that email — they need to sign up first" },
        { status: 404 },
      );
    }

    return Response.json({ user: result[0] });
  } catch (err) {
    console.error("POST /api/admin/promote error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
