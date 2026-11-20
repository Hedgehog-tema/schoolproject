import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Materials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMaterials(Boolean(user))
      .then(({ materials }) => setMaterials(materials))
      .finally(() => setLoading(false));
  }, [user]);

  async function toggleSave(e, material) {
    e.preventDefault();
    if (!user) return;
    if (material.saved) {
      await api.unsaveMaterial(material.id);
    } else {
      await api.saveMaterial(material.id);
    }
    setMaterials((list) =>
      list.map((m) => (m.id === material.id ? { ...m, saved: !m.saved } : m))
    );
  }

  return (
    <section className="section">
      <div className="container materials-page">
        <Reveal direction="up">
          <h1 className="materials-title">Materiaaleja:</h1>
        </Reveal>

        {loading && <div className="loading">Ladataan…</div>}

        <div className="materials-list">
          {materials.map((m, i) => (
            <Reveal direction={i % 2 === 0 ? "left" : "right"} key={m.id}>
              <div className="material-entry">
                {m.locked ? (
                  <>
                    <span className="material-link material-link-locked">{m.title}</span>
                    <p className="muted">{m.description}</p>
                    <div className="material-locked-note">
                      <span className="badge">Vain kirjautuneille</span>
                      <Link to="/kirjaudu" className="btn btn-outline btn-sm">
                        Kirjaudu nähdäksesi
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="material-link"
                    >
                      {m.title}
                    </a>
                    <p className="muted">{m.description}</p>
                    {user && (
                      <button
                        className="material-save-link"
                        onClick={(e) => toggleSave(e, m)}
                      >
                        {m.saved ? "✓ Tallennettu omaan kirjastoon" : "+ Tallenna omaan kirjastoon"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {!loading && materials.length === 0 && (
          <p className="empty-state">Materiaaleja ei ole vielä lisätty.</p>
        )}
      </div>
    </section>
  );
}
