import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    let query = sql`
      SELECT d.*, u.name as rider_name 
      FROM deliveries d
      LEFT JOIN auth_users u ON d.rider_id = u.id
      WHERE d.customer_id = ${userId}
    `;

    if (status) {
      query = sql`
        SELECT d.*, u.name as rider_name 
        FROM deliveries d
        LEFT JOIN auth_users u ON d.rider_id = u.id
        WHERE d.customer_id = ${userId} AND d.status = ${status}
      `;
    }

    const deliveries = await query;
    return Response.json({ deliveries });
  } catch (err) {
    console.error("GET /api/deliveries error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const {
      sender_name,
      sender_phone,
      receiver_name,
      receiver_phone,
      pickup_address,
      pickup_lat,
      pickup_lng,
      delivery_address,
      delivery_lat,
      delivery_lng,
      package_type,
      weight,
      priority,
      cost,
      notes,
    } = body;

    const tracking_id =
      "DL-" + Math.random().toString(36).substr(2, 6).toUpperCase();

    const result = await sql`
      INSERT INTO deliveries (
        customer_id, sender_name, sender_phone, receiver_name, receiver_phone,
        pickup_address, pickup_lat, pickup_lng,
        delivery_address, delivery_lat, delivery_lng,
        package_type, weight, priority, cost, notes, tracking_id, status
      ) VALUES (
        ${userId}, ${sender_name}, ${sender_phone}, ${receiver_name}, ${receiver_phone},
        ${pickup_address}, ${pickup_lat ?? null}, ${pickup_lng ?? null},
        ${delivery_address}, ${delivery_lat ?? null}, ${delivery_lng ?? null},
        ${package_type}, ${weight}, ${priority}, ${cost}, ${notes}, ${tracking_id}, 'Pending'
      ) RETURNING *
    `;

    return Response.json({ delivery: result[0] });
  } catch (err) {
    console.error("POST /api/deliveries error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
