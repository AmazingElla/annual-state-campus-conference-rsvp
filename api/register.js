import { db } from "hatchable";

export const access = "public";
export const methods = ["POST"];

export default async function (req, res) {
  const { full_name, phone, email, fellowship, church_department, position, location, attendance_mode } = req.body || {};
  if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2) {
    return res.status(400).json({ error: "Please enter your full name." });
  }
  if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
    return res.status(400).json({ error: "Please enter a valid phone number." });
  }
  if (typeof full_name !== "string" || full_name.length > 160 || phone.length > 40) {
    return res.status(400).json({ error: "Please check your details and try again." });
  }
  const result = await db.query(
    "INSERT INTO registrations (full_name, phone, email, fellowship, church_department, position, location, attendance_mode) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id",
    [full_name.trim(), phone.trim(), email || null, fellowship || null, church_department || null, position || null, location || null, attendance_mode || "Physical"]
  );
  res.json({ success: true, registration_id: result.rows[0].id, message: "Your registration has been received. We look forward to welcoming you." });
}