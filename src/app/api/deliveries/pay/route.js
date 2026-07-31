import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Pays for a delivery. Payment is deliberately collected late in the
// journey: the Pay button only appears (and this endpoint only accepts)
// once the package is out for delivery (In Transit) or already Delivered
// but not yet settled. The checkout itself is simulated — card/transfer
// mark the booking Paid immediately; cash records Pay on Delivery so the
// rider knows to collect.
const PAYMENT_METHODS = ["Card", "Bank Transfer", "Cash on Delivery"];
const PAYABLE_STATUSES = ["In Transit", "Delivered"];

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { delivery_id, payment_method } = await request.json();
    if (!delivery_id || !PAYMENT_METHODS.includes(payment_method)) {
      return Response.json(
        { error: "Invalid delivery or payment method" },
        { status: 400 },
      );
    }

    const rows = await sql`
      SELECT id, customer_id, status, payment_status
      FROM deliveries WHERE id = ${delivery_id}
    `;
    const delivery = rows[0];
    if (!delivery || String(delivery.customer_id) !== String(session.user.id)) {
      return Response.json({ error: "Delivery not found" }, { status: 404 });
    }
    if (delivery.payment_status === "Paid") {
      return Response.json(
        { error: "This delivery is already paid for" },
        { status: 400 },
      );
    }
    if (!PAYABLE_STATUSES.includes(delivery.status)) {
      return Response.json(
        { error: "You can pay once your package is out for delivery" },
        { status: 400 },
      );
    }

    const payment_status =
      payment_method === "Cash on Delivery" ? "Pay on Delivery" : "Paid";

    const result = await sql`
      UPDATE deliveries
      SET payment_method = ${payment_method}, payment_status = ${payment_status}
      WHERE id = ${delivery_id}
      RETURNING id, tracking_id, payment_method, payment_status, status
    `;

    return Response.json({ delivery: result[0] });
  } catch (err) {
    console.error("POST /api/deliveries/pay error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
