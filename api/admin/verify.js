import { db } from "hatchable";
export const access = "admin";
export const methods = ["POST"];
export default async function (req, res) {
  const { id } = req.body || {};
  if (!id || typeof id !== "string") return res.status(400).json({ error: "A contribution ID is required." });
  const result = await db.query("UPDATE contributions SET status = 'Verified', verified_at = now(), verified_by = $2 WHERE id = $1 AND status = 'Pending' RETURNING id", [id, "project-admin"]);
  if (!result.rowCount) return res.status(404).json({ error: "Pending contribution not found." });
  res.json({ success: true });
}