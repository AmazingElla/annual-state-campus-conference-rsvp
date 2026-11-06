import { db } from "hatchable";
export const access = "admin";
export const methods = ["GET"];
export default async function (req, res) {
  const [registrations, contributions, totals] = await Promise.all([
    db.query("SELECT id, full_name, phone, email, fellowship, church_department, position, location, attendance_mode, created_at FROM registrations ORDER BY created_at DESC LIMIT 1000"),
    db.query("SELECT id, full_name, phone, email, amount, payment_reference, donor_category, will_attend, status, receipt_key, created_at, verified_at FROM contributions ORDER BY created_at DESC LIMIT 1000"),
    db.query("SELECT COUNT(*) FILTER (WHERE true) AS registrant_count, (SELECT COUNT(*) FROM contributions) AS contribution_count, COALESCE((SELECT SUM(amount) FROM contributions WHERE status = 'Verified'),0) AS verified_total, COALESCE((SELECT SUM(amount) FROM contributions WHERE status = 'Pending'),0) AS pending_total FROM registrations")
  ]);
  res.json({ registrations: registrations.rows, contributions: contributions.rows, totals: totals.rows[0] });
}