import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    newsletterOptIn: user.newsletter_opt_in,
    createdAt: user.created_at,
  };
}

router.post("/register", async (req, res) => {
  const { email, password, fullName, newsletterOptIn } = req.body || {};

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: "Nimi, sähköposti ja salasana vaaditaan." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Salasanan tulee olla vähintään 8 merkkiä." });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email.toLowerCase().trim(),
    ]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Tämä sähköposti on jo rekisteröity." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, newsletter_opt_in)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [email.toLowerCase().trim(), passwordHash, fullName.trim(), Boolean(newsletterOptIn)]
    );
    const user = result.rows[0];

    if (newsletterOptIn) {
      await pool.query(
        `INSERT INTO newsletter_subscribers (email, user_id) VALUES ($1, $2)
         ON CONFLICT (email) DO NOTHING`,
        [user.email, user.id]
      );
    }

    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Rekisteröinti epäonnistui." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Sähköposti ja salasana vaaditaan." });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase().trim(),
    ]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Väärä sähköposti tai salasana." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Väärä sähköposti tai salasana." });
    }

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kirjautuminen epäonnistui." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "Käyttäjää ei löytynyt." });
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Virhe haettaessa käyttäjää." });
  }
});

router.patch("/me", requireAuth, async (req, res) => {
  const { fullName, newsletterOptIn } = req.body || {};
  try {
    const result = await pool.query(
      `UPDATE users SET
         full_name = COALESCE($1, full_name),
         newsletter_opt_in = COALESCE($2, newsletter_opt_in)
       WHERE id = $3 RETURNING *`,
      [fullName ?? null, typeof newsletterOptIn === "boolean" ? newsletterOptIn : null, req.user.id]
    );
    res.json({ user: publicUser(result.rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Profiilin päivitys epäonnistui." });
  }
});

export default router;
