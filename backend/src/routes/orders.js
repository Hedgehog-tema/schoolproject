import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = Router();

// Create an order request. Works for guests too, but if logged in,
// the order is linked to the account and shows up in the dashboard.
router.post("/", optionalAuth, async (req, res) => {
  const {
    bookId,
    quantity = 1,
    contactName,
    contactEmail,
    contactPhone,
    shippingAddress,
    note,
  } = req.body || {};

  if (!bookId || !contactName || !contactEmail) {
    return res.status(400).json({ error: "Kirja, nimi ja sähköposti vaaditaan." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders
         (user_id, book_id, quantity, contact_name, contact_email, contact_phone, shipping_address, note)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        req.user?.id ?? null,
        bookId,
        quantity,
        contactName,
        contactEmail,
        contactPhone ?? null,
        shippingAddress ?? null,
        note ?? null,
      ]
    );
    res.status(201).json({ order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Tilauksen lähetys epäonnistui." });
  }
});

// Logged-in user's own order history.
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, b.title AS book_title, b.cover_image_url AS book_cover
       FROM orders o JOIN books b ON b.id = o.book_id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ orders: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Tilausten haku epäonnistui." });
  }
});

export default router;
