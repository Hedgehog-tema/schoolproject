import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/", label: "Etusivu" },
  { to: "/#kuka-mina-olen", label: "Kuka minä olen?", anchor: "kuka-mina-olen" },
  { to: "/toppotassut", label: "Töppötassut" },
  { to: "/kuvia", label: "Kuvia" },
  { to: "/materiaalit", label: "Materiaalit" },
  { to: "/blog", label: "Blogi" },
  { to: "/yhteystiedot", label: "Yhteystiedot" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  function handleAnchorClick(e, anchorId) {
    e.preventDefault();
    setOpen(false);
    if (location.pathname === "/") {
      // Already home: just smooth-scroll, no page reload / re-render.
      document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Navigate home first; Home.jsx watches the hash and scrolls once it's mounted.
      navigate(`/#${anchorId}`);
    }
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          Taija Ruuhijärvi
        </NavLink>

        <button
          className="navbar-toggle"
          aria-label="Valikko"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <nav className={`navbar-links ${open ? "is-open" : ""}`}>
          {links.map((l) =>
            l.anchor ? (
              <a
                key={l.to}
                href={l.to}
                onClick={(e) => handleAnchorClick(e, l.anchor)}
                className={location.pathname === "/" && location.hash === `#${l.anchor}` ? "is-active" : ""}
              >
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) => (isActive ? "is-active" : "")}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            )
          )}

          <div className="navbar-auth">
            {user ? (
              <>
                <NavLink to="/oma-tili" className="btn btn-secondary btn-sm" onClick={() => setOpen(false)}>
                  Oma tili
                </NavLink>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Kirjaudu ulos
                </button>
              </>
            ) : (
              <>
                <NavLink to="/kirjaudu" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
                  Kirjaudu
                </NavLink>
                <NavLink to="/rekisteroidy" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                  Luo tili
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
