import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, slug, title, excerpt, cover_image_url, published_at FROM blog_posts ORDER BY published_at DESC"
    );
    res.json({ posts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Blogin haku epäonnistui." });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blog_posts WHERE slug = $1", [
      req.params.slug,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Artikkelia ei löytynyt." });
    }
    res.json({ post: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Artikkelin haku epäonnistui." });
  }
});

export default router;
