import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = Router();

// List all materials. If logged in, also mark which ones the user saved,
// and reveal file_url only for materials that don't require login or that
// the user is allowed to access (keeps it simple: logged-in users can see all).
router.get("/", optionalAuth, async (req, res) => {
  try {
    const materials = await pool.query("SELECT * FROM materials ORDER BY created_at DESC");

    let savedIds = new Set();
    if (req.user) {
      const saved = await pool.query(
        "SELECT material_id FROM user_materials WHERE user_id = $1",
        [req.user.id]
      );
      savedIds = new Set(saved.rows.map((r) => r.material_id));
    }

    const result = materials.rows.map((m) => {
      const locked = m.requires_login && !req.user;
      return {
        id: m.id,
        title: m.title,
        description: m.description,
        requiresLogin: m.requires_login,
        locked,
        fileUrl: locked ? null : m.file_url,
        saved: savedIds.has(m.id),
      };
    });

    res.json({ materials: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Materiaalien haku epäonnistui." });
  }
});

// Save a material to "my library" (just tracks interest / quick access).
router.post("/:id/save", requireAuth, async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO user_materials (user_id, material_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [req.user.id, req.params.id]
    );
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Tallennus epäonnistui." });
  }
});

router.delete("/:id/save", requireAuth, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM user_materials WHERE user_id = $1 AND material_id = $2",
      [req.user.id, req.params.id]
    );
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Poisto epäonnistui." });
  }
});

export default router;
