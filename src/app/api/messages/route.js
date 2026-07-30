import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

const VALID_TYPES = ["contact", "feedback", "report"];

export async function POST(request) {
  try {
    const body = await request.json();
    let {
      type = "contact",
      delivery_id = null,
      name,
      email,
      subject,
      message,
      rating = null,
    } = body;

    if (!VALID_TYPES.includes(type)) {
      return Response.json({ error: "Invalid message type" }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return Response.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    const session = await auth();
    let customerId = null;

    if (session?.user?.id) {
      // Logged in: trust the session for identity, not client-supplied fields.
      const userRows =
        await sql`SELECT id, name, email FROM auth_users WHERE id = ${session.user.id}`;
      const user = userRows[0];
      if (user) {
        customerId = user.id;
        name = user.name;
        email = user.email;
      }
    } else if (type !== "contact") {
      // Feedback/reports are tied to a specific delivery a customer owns —
      // anonymous visitors can only send general contact messages.
      return Response.json(
        { error: "Sign in to send feedback or report a problem" },
        { status: 401 },
      );
    }

    if (delivery_id) {
      const deliveryRows = await sql`
        SELECT id FROM deliveries WHERE id = ${delivery_id} AND customer_id = ${customerId}
      `;
      if (deliveryRows.length === 0) {
        return Response.json({ error: "Delivery not found" }, { status: 404 });
      }
    }

    if (rating !== null && (rating < 1 || rating > 5)) {
      return Response.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO customer_messages (
        customer_id, delivery_id, type, name, email, subject, message, rating
      ) VALUES (
        ${customerId}, ${delivery_id}, ${type}, ${name}, ${email}, ${subject}, ${message}, ${rating}
      ) RETURNING *
    `;

    return Response.json({ message: result[0] });
  } catch (err) {
    console.error("POST /api/messages error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const messages = await sql`
      SELECT m.*, d.tracking_id
      FROM customer_messages m
      LEFT JOIN deliveries d ON m.delivery_id = d.id
      WHERE m.customer_id = ${userId}
      ORDER BY m.created_at DESC
    `;

    return Response.json({ messages });
  } catch (err) {
    console.error("GET /api/messages error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
