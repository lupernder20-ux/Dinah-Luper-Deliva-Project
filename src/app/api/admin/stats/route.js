import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { isAdminRole } from "@/app/api/utils/roles";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user is an admin
    const userRows =
      await sql`SELECT role FROM auth_users WHERE id = ${userId}`;
    if (!isAdminRole(userRows[0]?.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const stats = await sql.transaction([
      sql`SELECT count(*) as total FROM auth_users WHERE role = 'customer'`,
      sql`SELECT count(*) as total FROM auth_users WHERE role = 'rider'`,
      sql`SELECT count(*) as total FROM deliveries`,
      sql`SELECT count(*) as total FROM deliveries WHERE status = 'Delivered'`,
      sql`SELECT SUM(cost) as total FROM deliveries WHERE status = 'Delivered'`,
      sql`SELECT * FROM auth_users ORDER BY created_at DESC LIMIT 10`,
      sql`SELECT d.*, c.name as customer_name, r.name as rider_name 
          FROM deliveries d 
          LEFT JOIN auth_users c ON d.customer_id = c.id
          LEFT JOIN auth_users r ON d.rider_id = r.id
          ORDER BY d.created_at DESC LIMIT 10`,
    ]);

    // Real monthly trend for the last 6 months, straight from the
    // deliveries table. generate_series keeps months with no activity in
    // the series (as zeros) so the charts always show a full 6-month axis.
    // Revenue counts Delivered orders only; volume counts every booking
    // made that month, so new rides move the charts as they come in.
    const trendRows = await sql`
      SELECT
        to_char(m.month, 'Mon') AS month,
        COALESCE(SUM(d.cost) FILTER (WHERE d.status = 'Delivered'), 0) AS revenue,
        COUNT(d.id) AS volume
      FROM generate_series(
        date_trunc('month', now()) - interval '5 months',
        date_trunc('month', now()),
        interval '1 month'
      ) AS m(month)
      LEFT JOIN deliveries d
        ON date_trunc('month', d.created_at) = m.month
      GROUP BY m.month
      ORDER BY m.month
    `;
    const revenueTrend = trendRows.map((r) => ({
      month: r.month,
      revenue: Number(r.revenue),
      volume: Number(r.volume),
    }));

    return Response.json({
      customersCount: stats[0][0].total,
      ridersCount: stats[1][0].total,
      totalDeliveries: stats[2][0].total,
      completedDeliveries: stats[3][0].total,
      totalRevenue: stats[4][0].total || 0,
      recentUsers: stats[5],
      recentDeliveries: stats[6],
      revenueTrend,
    });
  } catch (err) {
    console.error("GET /api/admin/stats error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
