import { useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Footer() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.subscribeNewsletter(email, Boolean(user));
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-newsletter">
          <h3>Tilaa uutiskirje</h3>
          <p className="muted">Kuulet ensimmäisenä uusista kirjoista ja tapahtumista.</p>

          {status === "done" ? (
            <p className="form-success">Kiitos tilauksesta!</p>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="sähköpostisi@osoite.fi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-primary btn-sm" disabled={status === "sending"}>
                {status === "sending" ? "Lähetetään…" : "Tilaa"}
              </button>
            </form>
          )}
          {status === "error" && <p className="form-error">Tilaus epäonnistui, yritä uudelleen.</p>}
        </div>

        <div className="footer-social">
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.pinterest.com" target="_blank" rel="noreferrer">Pinterest</a>
        </div>

        <p className="footer-copy muted">© 2026 by Artem Komarov</p>
      </div>
    </footer>
  );
}
