import { db, storage } from "hatchable";
export const access = "admin";
export const methods = ["GET"];
export default async function (req, res) {
  const id = req.query?.id;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Receipt ID is required." });
  const row = (await db.query("SELECT receipt_key FROM contributions WHERE id = $1", [id])).rows[0];
  if (!row?.receipt_key) return res.status(404).json({ error: "Receipt not found." });
  const file = await storage.get(row.receipt_key);
  res.setHeader("Content-Type", file.contentType || "application/octet-stream");
  res.setHeader("Cache-Control", "no-store");
  res.send(file.buffer);
}