import { db, storage } from "hatchable";
import crypto from "node:crypto";

export const access = "public";
export const methods = ["POST"];

export default async function (req, res) {
  const { full_name, phone, amount, payment_reference, email, donor_category, will_attend } = req.body || {};
  const numericAmount = Number(amount);
  if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2 || full_name.length > 160) return res.status(400).json({ error: "Please enter your full name." });
  if (!phone || typeof phone !== "string" || phone.trim().length < 7 || phone.length > 40) return res.status(400).json({ error: "Please enter a valid phone number." });
  if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 100000000) return res.status(400).json({ error: "Enter a valid contribution amount." });
  if (!["Undergraduate","Working-class","General supporter","Other"].includes(donor_category)) return res.status(400).json({ error: "Select your contributor category." });
  if (!["Yes","No"].includes(will_attend)) return res.status(400).json({ error: "Please tell us whether you will attend." });
  const file = (req.files || []).find(f => f.field === "receipt");
  if (!file) return res.status(400).json({ error: "Please upload your proof of payment." });
  const allowed = new Set(["image/jpeg","image/png","image/webp","application/pdf"]);
  if (!allowed.has(file.contentType)) return res.status(415).json({ error: "Receipt must be a JPG, PNG, WEBP or PDF." });
  if (file.buffer.length > 8 * 1024 * 1024) return res.status(413).json({ error: "Receipt must be smaller than 8 MB." });
  const ext = file.filename.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,8) || "bin";
  const receiptKey = "receipts/" + crypto.randomUUID() + "." + ext;
  await storage.put(receiptKey, file.buffer, file.contentType);
  const result = await db.query(
    "INSERT INTO contributions (full_name, phone, amount, payment_reference, receipt_key, email, donor_category, will_attend) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id",
    [full_name.trim(), phone.trim(), numericAmount, payment_reference || null, receiptKey, email || null, donor_category, will_attend]
  );
  res.json({ success: true, contribution_id: result.rows[0].id, message: "Thank you. Your contribution has been submitted for verification." });
}