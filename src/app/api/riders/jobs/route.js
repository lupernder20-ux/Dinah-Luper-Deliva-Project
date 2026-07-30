import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user is a rider
    const userRows =
      await sql`SELECT role FROM auth_users WHERE id = ${userId}`;
    if (userRows[0]?.role !== "rider") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // List available jobs (Pending) and assigned jobs
    const availableJobs = await sql`
      SELECT * FROM deliveries WHERE status = 'Pending' ORDER BY created_at DESC
    `;

    const myJobs = await sql`
      SELECT * FROM deliveries WHERE rider_id = ${userId} AND status != 'Delivered' AND status != 'Cancelled' ORDER BY created_at DESC
    `;

    const completedJobs = await sql`
      SELECT * FROM deliveries WHERE rider_id = ${userId} AND status = 'Delivered' ORDER BY created_at DESC
    `;

    const riderProfile = await sql`
      SELECT * FROM riders_profile WHERE user_id = ${userId}
    `;

    return Response.json({
      availableJobs,
      myJobs,
      completedJobs,
      profile: riderProfile[0] || null,
    });
  } catch (err) {
    console.error("GET /api/riders/jobs error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
