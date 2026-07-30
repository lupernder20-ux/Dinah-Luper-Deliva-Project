import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Data-URI images only (client resizes to a small JPEG before sending) —
// this keeps profile pictures inside the existing Postgres row with no
// separate file/object storage to set up. ~2MB covers a resized avatar
// comfortably with headroom.
const MAX_IMAGE_LENGTH = 2 * 1024 * 1024;

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await sql`
      SELECT name, email, image, phone, role FROM auth_users WHERE id = ${session.user.id}
    `;
    return Response.json({ user: rows[0] || null });
  } catch (err) {
    console.error("GET /api/account/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = body.name ?? null;
    const image = body.image ?? null;

    if (image && image.length > MAX_IMAGE_LENGTH) {
      return Response.json({ error: "Image is too large" }, { status: 400 });
    }
    if (image && !image.startsWith("data:image/")) {
      return Response.json({ error: "Invalid image format" }, { status: 400 });
    }

    const rows = await sql`
      UPDATE auth_users
      SET
        name = COALESCE(${name}, name),
        image = COALESCE(${image}, image)
      WHERE id = ${session.user.id}
      RETURNING name, email, image, phone, role
    `;

    return Response.json({ user: rows[0] });
  } catch (err) {
    console.error("PUT /api/account/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
