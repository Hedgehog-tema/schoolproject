import { Router } from "express";
import { pool } from "../db/pool.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", optionalAuth, async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Sähköposti vaaditaan." });
  }
  try {
    await pool.query(
      `INSERT INTO newsletter_subscribers (email, user_id) VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase().trim(), req.user?.id ?? null]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Tilaus epäonnistui." });
  }
});

export default router;
