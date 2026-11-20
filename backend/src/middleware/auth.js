import jwt from "jsonwebtoken";

// Requires a valid Bearer token. Attaches req.user = { id, email }.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Kirjaudu sisään jatkaaksesi." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Istunto vanhentunut, kirjaudu uudelleen." });
  }
}

// Attaches req.user if a valid token is present, but does not block the request.
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
  } catch {
    // ignore invalid token on optional routes
  }
  next();
}
