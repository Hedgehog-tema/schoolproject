import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../api/client.js";
import Reveal from "../components/Reveal.jsx";

export default function Home() {
  const [book, setBook] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    Promise.all([api.getBooks(), api.getBlogPosts()])
      .then(([{ books }, { posts }]) => {
        if (!active) return;
        setBook(books.find((b) => b.featured) || books[0] || null);
        setPosts(posts.slice(0, 2));
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Smooth-scroll to a section when arriving via a hash link (e.g. navbar "Kuka minä olen?").
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    // Wait a tick so the section has rendered before we measure/scroll to it.
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(timer);
  }, [location.hash, loading]);

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <Reveal direction="left" className="hero-text">
            <p className="section-eyebrow">Esikoisteos</p>
            <h1>TAIJA RUUHIJÄRVI</h1>
            <p className="hero-lede">
              Turkulainen kirjailija, joka kirjoittaa ja kuvittaa lämminhenkisiä lastenkirjoja.
            </p>
            {book && (
              <div className="hero-actions">
                <Link to={`/toppotassut`} className="btn btn-primary">
                  Tutustu kirjaan
                </Link>
                <Link to="/tilaukset" className="btn btn-outline">
                  Tilaa tästä
                </Link>
              </div>
            )}
          </Reveal>

          {book && (
            <Reveal direction="right" className="hero-book" delay={100}>
              <img src={book.cover_image_url} alt={book.title} />
            </Reveal>
          )}
        </div>
      </section>

      {book && (
        <section className="section featured-book">
          <div className="container featured-book-inner">
            <Reveal direction="left">
              <img src={book.cover_image_url} alt={book.title} className="featured-book-cover" />
            </Reveal>
            <Reveal direction="right" delay={100}>
              <p className="section-eyebrow">Suositeltu kirja</p>
              <h2>HYVIÄ KIRJOJA EI OLE KOSKAAN LIIKAA</h2>
              <h3>{book.title}{book.subtitle ? ` – ${book.subtitle}` : ""}</h3>
              <p className="muted">{book.description}</p>
              <Link to="/tilaukset" className="btn btn-secondary">
                Tee tilauspyyntö
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <section id="kuka-mina-olen" className="section about-section anchor-target">
        <div className="container">
          <Reveal direction="up">
            <p className="section-eyebrow">Kirjailija</p>
            <h2 className="section-title">Kuka minä olen?</h2>
          </Reveal>

          <div className="about-content card">
            <Reveal direction="left">
              <img
                src="https://static.wixstatic.com/media/5b46f2_ab26d741b79d4b19a989ceef6e00a719~mv2.jpg/v1/fill/w_397,h_529,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Taija_kuva.jpg"
                alt="Taija Ruuhijärvi"
                className="about-photo"
              />
            </Reveal>
            <Reveal direction="right" delay={100}>
              <p>
                Luin kahdeksanvuotiaana Pieni runotyttö -kirjan ja päätin, että minusta tulee
                jonain päivänä kirjailija. Koulussa ainekirjoitukseni luettiin aina ääneen, joka
                tuotti suurta hämmennystä.
              </p>
              <p>
                Olin pitkään mielessäni kehitellyt tarinaa lastenkirjaksi. Minulla on tytär ja
                viisi kummilasta. Heidän vauva-aikoinaan kutsuin heitä välillä pikku
                töppötassuiksi ja siitä sai lastenkirjani eläinhahmo nimensä.
              </p>
              <p>
                Kirjoitin käsikirjoitusta kymmenen vuotta, lisäsin, poistin ja lisäsin. Päätin
                uskoa unelmaani. Pari vuotta sitten päätin myös kuvittaa teokseni. Pikkuhiljaa
                tarina ja kuvat loksahtivat paikoilleen ja nyt olen onnellinen esikoiskirjan
                julkaissut turkulainen kirjailija.
              </p>
              <p>
                Momentum kirjat on julkaissut esikoisteokseni <strong>TÖPPÖTASSUT, Suuri
                seikkailu</strong> 21.9.2023.
              </p>
              <p className="signature">— Taija Ruuhijärvi</p>
            </Reveal>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="section news-section">
          <div className="container">
            <Reveal direction="up">
              <h2 className="section-title">Uutisia</h2>
            </Reveal>
            <div className="grid grid-2">
              {posts.map((p, i) => (
                <Reveal direction={i % 2 === 0 ? "left" : "right"} key={p.id}>
                  <Link to={`/blog/${p.slug}`} className="card news-card">
                    {p.cover_image_url && <img src={p.cover_image_url} alt={p.title} />}
                    <h3>{p.title}</h3>
                    <p className="muted">{p.excerpt}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {loading && <div className="loading">Ladataan…</div>}
    </div>
  );
}
