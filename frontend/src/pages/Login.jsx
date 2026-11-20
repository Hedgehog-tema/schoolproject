import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const redirectTo = location.state?.from?.pathname || "/oma-tili";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="center">Kirjaudu sisään</h1>

        <form className="card form-card" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="field">
            <label htmlFor="email">Sähköposti</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Salasana</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Kirjaudutaan…" : "Kirjaudu"}
          </button>

          <p className="muted center" style={{ marginTop: 16 }}>
            Ei vielä tiliä? <Link to="/rekisteroidy">Luo tili</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
