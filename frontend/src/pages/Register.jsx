import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    newsletterOptIn: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/oma-tili", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="center">Luo tili</h1>

        <form className="card form-card" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="field">
            <label htmlFor="fullName">Nimi</label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Sähköposti</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Salasana</label>
            <input
              id="password"
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
            />
            <span className="muted" style={{ fontSize: "0.8rem" }}>
              Vähintään 8 merkkiä.
            </span>
          </div>

          <div className="field field-check">
            <input
              id="newsletter"
              type="checkbox"
              checked={form.newsletterOptIn}
              onChange={(e) => update("newsletterOptIn", e.target.checked)}
            />
            <label htmlFor="newsletter">Haluan tilata uutiskirjeen</label>
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Luodaan tiliä…" : "Luo tili"}
          </button>

          <p className="muted center" style={{ marginTop: 16 }}>
            Onko sinulla jo tili? <Link to="/kirjaudu">Kirjaudu sisään</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
