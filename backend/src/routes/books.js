import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY featured DESC, created_at DESC");
    res.json({ books: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kirjojen haku epäonnistui." });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE slug = $1", [req.params.slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Kirjaa ei löytynyt." });
    }
    res.json({ book: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kirjan haku epäonnistui." });
  }
});

export default router;
