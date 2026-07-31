import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { isSuperAdminRole } from "@/app/api/utils/roles";

const VALID_ROLES = ["customer", "rider", "admin", "super_admin"];

// List current admins & super admins — powers the Manage Admins panel on
// the admin dashboard. Super admin only.
export async function GET() {
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

    const admins = await sql`
      SELECT id, name, email, role, created_at
      FROM auth_users
      WHERE role IN ('admin', 'super_admin')
      ORDER BY (role = 'super_admin') DESC, created_at ASC
    `;
    return Response.json({ admins });
  } catch (err) {
    console.error("GET /api/admin/promote error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const callerRows =
      await sql`SELECT email, role FROM auth_users WHERE id = ${session.user.id}`;
    if (!isSuperAdminRole(callerRows[0]?.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, role } = await request.json();
    if (!email || !VALID_ROLES.includes(role)) {
      return Response.json({ error: "Invalid email or role" }, { status: 400 });
    }

    // A super admin demoting their own account would lock everyone out of
    // this panel — refuse it.
    if (
      email.toLowerCase() === callerRows[0].email?.toLowerCase() &&
      role !== "super_admin"
    ) {
      return Response.json(
        { error: "You can't remove your own super admin role" },
        { status: 400 },
      );
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
