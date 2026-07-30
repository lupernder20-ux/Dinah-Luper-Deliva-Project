import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const tracking_id = url.searchParams.get("id");

    if (!tracking_id) {
      return Response.json(
        { error: "Tracking ID is required" },
        { status: 400 },
      );
    }

    const rows = await sql`
      SELECT d.*, u.name as rider_name, u.phone as rider_phone
      FROM deliveries d
      LEFT JOIN auth_users u ON d.rider_id = u.id
      WHERE d.tracking_id = ${tracking_id}
    `;

    if (rows.length === 0) {
      return Response.json({ error: "Delivery not found" }, { status: 404 });
    }

    return Response.json({ delivery: rows[0] });
  } catch (err) {
    console.error("GET /api/deliveries/track error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
