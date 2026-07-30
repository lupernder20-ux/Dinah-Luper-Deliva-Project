import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = params;
    const body = await request.json();
    const { action, status } = body;

    // Verify rider role
    const userRows =
      await sql`SELECT role FROM auth_users WHERE id = ${userId}`;
    if (userRows[0]?.role !== "rider") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (action === "accept") {
      // Transaction to ensure atomic update
      const result = await sql`
        UPDATE deliveries 
        SET rider_id = ${userId}, status = 'Accepted'
        WHERE id = ${id} AND rider_id IS NULL AND status = 'Pending'
        RETURNING *
      `;
      if (result.length === 0) {
        return Response.json(
          { error: "Job already taken or unavailable" },
          { status: 400 },
        );
      }
      return Response.json({ delivery: result[0] });
    }

    if (status) {
      const result = await sql`
        UPDATE deliveries 
        SET status = ${status}
        WHERE id = ${id} AND rider_id = ${userId}
        RETURNING *
      `;

      // If delivered, update earnings
      if (status === "Delivered" && result.length > 0) {
        const cost = result[0].cost;
        const earningsIncrease = Number(cost) * 0.8; // Rider gets 80%
        await sql`
          UPDATE riders_profile 
          SET earnings = earnings + ${earningsIncrease}, total_jobs = total_jobs + 1
          WHERE user_id = ${userId}
        `;
      }

      return Response.json({ delivery: result[0] });
    }

    return Response.json({ error: "Invalid request" }, { status: 400 });
  } catch (err) {
    console.error("PUT /api/riders/jobs/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
