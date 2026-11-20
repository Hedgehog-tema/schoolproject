import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import orderRoutes from "./routes/orders.js";
import materialRoutes from "./routes/materials.js";
import blogRoutes from "./routes/blog.js";
import galleryRoutes from "./routes/gallery.js";
import newsletterRoutes from "./routes/newsletter.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Fallback error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Palvelinvirhe." });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
