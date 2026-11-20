import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM gallery_images ORDER BY sort_order ASC, id ASC"
    );
    res.json({ images: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kuvien haku epäonnistui." });
  }
});

export default router;
