import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const statusLabels = {
  new: "Vastaanotettu",
  confirmed: "Vahvistettu",
  shipped: "Lähetetty",
  cancelled: "Peruutettu",
};

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState("overview");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);

  const [profile, setProfile] = useState({ fullName: user?.fullName || "", newsletterOptIn: user?.newsletterOptIn || false });
  const [profileStatus, setProfileStatus] = useState("idle");

  useEffect(() => {
    api.getMyOrders().then(({ orders }) => setOrders(orders)).finally(() => setOrdersLoading(false));
    api.getMaterials(true).then(({ materials }) => setMaterials(materials)).finally(() => setMaterialsLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({ fullName: user.fullName, newsletterOptIn: user.newsletterOptIn });
    }
  }, [user]);

  async function saveProfile(e) {
    e.preventDefault();
    setProfileStatus("saving");
    try {
      await api.updateMe(profile);
      await refreshUser();
      setProfileStatus("done");
      setTimeout(() => setProfileStatus("idle"), 2000);
    } catch {
      setProfileStatus("error");
    }
  }

  async function unsaveMaterial(id) {
    await api.unsaveMaterial(id);
    setMaterials((list) => list.map((m) => (m.id === id ? { ...m, saved: false } : m)));
  }

  const savedMaterials = materials.filter((m) => m.saved);
  const latestOrder = orders[0];

  return (
    <section className="section">
      <div className="container dashboard">
        <div className="dashboard-header">
          <div>
            <p className="section-eyebrow">Oma tili</p>
            <h1>Hei, {user?.fullName?.split(" ")[0] || "sinä"}! 👋</h1>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button className={tab === "overview" ? "is-active" : ""} onClick={() => setTab("overview")}>
            Yhteenveto
          </button>
          <button className={tab === "orders" ? "is-active" : ""} onClick={() => setTab("orders")}>
            Tilaukseni ({orders.length})
          </button>
          <button className={tab === "materials" ? "is-active" : ""} onClick={() => setTab("materials")}>
            Oma kirjasto ({savedMaterials.length})
          </button>
          <button className={tab === "profile" ? "is-active" : ""} onClick={() => setTab("profile")}>
            Profiili
          </button>
        </div>

        {tab === "overview" && (
          <div className="grid grid-3">
            <div className="card stat-card">
              <p className="stat-number">{orders.length}</p>
              <p className="muted">Tilauspyyntöä lähetetty</p>
            </div>
            <div className="card stat-card">
              <p className="stat-number">{savedMaterials.length}</p>
              <p className="muted">Materiaalia tallennettu</p>
            </div>
            <div className="card stat-card">
              <p className="stat-number">{user?.newsletterOptIn ? "Kyllä" : "Ei"}</p>
              <p className="muted">Uutiskirjeen tilaus</p>
            </div>

            {latestOrder && (
              <div className="card overview-latest">
                <h3>Viimeisin tilaus</h3>
                <p>
                  <strong>{latestOrder.book_title}</strong> × {latestOrder.quantity}
                </p>
                <p className="muted">
                  {statusLabels[latestOrder.status] || latestOrder.status} ·{" "}
                  {new Date(latestOrder.created_at).toLocaleDateString("fi-FI")}
                </p>
              </div>
            )}

            <div className="card overview-latest">
              <h3>Pikalinkit</h3>
              <div className="quick-links">
                <Link to="/tilaukset" className="btn btn-primary btn-sm">Tee uusi tilaus</Link>
                <Link to="/materiaalit" className="btn btn-outline btn-sm">Selaa materiaaleja</Link>
              </div>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div>
            {ordersLoading && <div className="loading">Ladataan…</div>}
            {!ordersLoading && orders.length === 0 && (
              <div className="empty-state">
                <p>Ei vielä tilauksia.</p>
                <Link to="/tilaukset" className="btn btn-primary btn-sm">Tee ensimmäinen tilaus</Link>
              </div>
            )}
            <div className="order-list">
              {orders.map((o) => (
                <div className="card order-row" key={o.id}>
                  {o.book_cover && <img src={o.book_cover} alt={o.book_title} />}
                  <div className="order-row-info">
                    <h4>{o.book_title}</h4>
                    <p className="muted">Määrä: {o.quantity}</p>
                    <p className="muted">{new Date(o.created_at).toLocaleDateString("fi-FI")}</p>
                  </div>
                  <span className={`badge status-${o.status}`}>
                    {statusLabels[o.status] || o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "materials" && (
          <div>
            {materialsLoading && <div className="loading">Ladataan…</div>}
            {!materialsLoading && savedMaterials.length === 0 && (
              <div className="empty-state">
                <p>Et ole vielä tallentanut materiaaleja.</p>
                <Link to="/materiaalit" className="btn btn-primary btn-sm">Selaa materiaaleja</Link>
              </div>
            )}
            <div className="grid grid-2">
              {savedMaterials.map((m) => (
                <div className="card material-card" key={m.id}>
                  <h3>{m.title}</h3>
                  <p className="muted">{m.description}</p>
                  <div className="material-actions">
                    <a href={m.fileUrl} className="btn btn-secondary btn-sm" download>
                      Lataa
                    </a>
                    <button className="btn btn-outline btn-sm" onClick={() => unsaveMaterial(m.id)}>
                      Poista kirjastosta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "profile" && (
          <form className="card form-card" onSubmit={saveProfile}>
            {profileStatus === "done" && <div className="form-success">Tallennettu!</div>}
            {profileStatus === "error" && <div className="form-error">Tallennus epäonnistui.</div>}

            <div className="field">
              <label htmlFor="fullName">Nimi</label>
              <input
                id="fullName"
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
              />
            </div>

            <div className="field">
              <label>Sähköposti</label>
              <input type="email" value={user?.email || ""} disabled />
            </div>

            <div className="field field-check">
              <input
                id="newsletterOptIn"
                type="checkbox"
                checked={profile.newsletterOptIn}
                onChange={(e) => setProfile((p) => ({ ...p, newsletterOptIn: e.target.checked }))}
              />
              <label htmlFor="newsletterOptIn">Haluan tilata uutiskirjeen</label>
            </div>

            <button className="btn btn-primary" disabled={profileStatus === "saving"}>
              {profileStatus === "saving" ? "Tallennetaan…" : "Tallenna muutokset"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
