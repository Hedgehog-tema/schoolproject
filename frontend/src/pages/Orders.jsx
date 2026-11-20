import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Orders() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    bookId: "",
    quantity: 1,
    contactName: user?.fullName || "",
    contactEmail: user?.email || "",
    contactPhone: "",
    shippingAddress: "",
    note: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  useEffect(() => {
    api.getBooks().then(({ books }) => {
      setBooks(books);
      setForm((f) => ({ ...f, bookId: f.bookId || books[0]?.id || "" }));
    });
  }, []);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        contactName: f.contactName || user.fullName,
        contactEmail: f.contactEmail || user.email,
      }));
    }
  }, [user]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await api.createOrder(
        {
          ...form,
          bookId: Number(form.bookId),
          quantity: Number(form.quantity) || 1,
        },
        Boolean(user)
      );
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <p className="section-eyebrow">Tilaukset</p>
        <h1 className="center">Tee tilauspyyntö</h1>
        <p className="section-lead">
          Täytä lomake, niin olen sinuun yhteydessä sähköpostitse tilauksen vahvistamiseksi ja
          maksutietojen osalta. Verkkomaksua ei (vielä) ole käytössä.
        </p>

        {status === "done" ? (
          <div className="card form-card center">
            <h2>Kiitos tilauksesta! 🎉</h2>
            <p className="muted">
              Olen sinuun yhteydessä pian sähköpostitse osoitteeseen {form.contactEmail}.
            </p>
          </div>
        ) : (
          <form className="card form-card" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            <div className="field">
              <label htmlFor="book">Kirja</label>
              <select
                id="book"
                value={form.bookId}
                onChange={(e) => update("bookId", e.target.value)}
                required
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} {b.price_cents > 0 ? `– ${(b.price_cents / 100).toFixed(2)} €` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="quantity">Määrä</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => update("quantity", e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="name">Nimi</label>
              <input
                id="name"
                type="text"
                value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">Sähköposti</label>
              <input
                id="email"
                type="email"
                value={form.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Puhelin (valinnainen)</label>
              <input
                id="phone"
                type="tel"
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="address">Toimitusosoite</label>
              <textarea
                id="address"
                rows={3}
                value={form.shippingAddress}
                onChange={(e) => update("shippingAddress", e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="note">Viesti (valinnainen)</label>
              <textarea
                id="note"
                rows={3}
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
              />
            </div>

            <button className="btn btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "Lähetetään…" : "Lähetä tilauspyyntö"}
            </button>

            {!user && (
              <p className="muted center" style={{ marginTop: 12 }}>
                Vinkki: <a href="/rekisteroidy">luo tili</a>, niin näet kaikki tilauksesi omalta
                tililtäsi.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
