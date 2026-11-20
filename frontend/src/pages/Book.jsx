import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import Reveal from "../components/Reveal.jsx";

const characters = [
  {
    name: "Tumperoinen",
    text: "oli pienenä rauhallinen, kunnes eräänä aamuna heräsi energisenä ja voimakkaana.",
  },
  {
    name: "Maturainen",
    text: "on hajamielinen koripalloilija, joka syö pizzasta vain reunat.",
  },
  {
    name: "Tyrannosaurus Rex",
    text: "rakastaa hyvää ruokaa.",
  },
  {
    name: "Teresa",
    text: "rakastaa leipomista ja kitaransoittoa.",
  },
  {
    name: "Milla",
    text: "joukkion toinen tyttö, on kantaaottavaääninen tanssija.",
  },
  {
    name: "Temppu",
    text: "porukan vanhinta, ei koskaan tarvitse houkutella mukaan seikkailuleikkeihin.",
  },
];

export default function Book() {
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getBook("toppotassut")
      .then(({ book }) => setBook(book))
      .catch(() => setError("Kirjaa ei löytynyt."));
  }, []);

  if (error) return <div className="empty-state">{error}</div>;
  if (!book) return <div className="loading">Ladataan…</div>;

  return (
    <>
      <section className="section">
        <div className="container book-page">
          <Reveal direction="left">
            <img src={book.cover_image_url} alt={book.title} className="book-cover" />
          </Reveal>
          <Reveal direction="right" delay={100}>
            <p className="badge">Esikoisteos</p>
            <h1>{book.title}</h1>
            {book.subtitle && <h2 className="book-subtitle">{book.subtitle}</h2>}
            <p>{book.description}</p>
            {book.published_date && (
              <p className="muted">
                Julkaistu {new Date(book.published_date).toLocaleDateString("fi-FI")}
              </p>
            )}
            {book.price_cents > 0 && (
              <p className="book-price">{(book.price_cents / 100).toFixed(2)} €</p>
            )}
            <Link to="/tilaukset" className="btn btn-primary">
              Tilaa tästä
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section book-intro">
        <div className="container book-intro-inner">
          <Reveal direction="up">
            <p>
              Tervetuloa kirjailija Taija Ruuhijärven kotisivuille. Täältä löydät tietoa
              kirjailijan teoksista, tapahtumista ja uutisista. Kirjailija Taija Ruuhijärvi on
              kirjoittanut ja kuvittanut lastenkirjan Töppötassut Suuri seikkailu, joka on
              herättänyt kiinnostusta ja saanut kiitosta niin lukijoilta kuin kriitikoiltakin.
              Tutustu, tilaa ja löydä uusi suosikkikirjasi.
            </p>
          </Reveal>

          <Reveal direction="up" delay={80}>
            <p>
              TÖPPÖTASSUT ovat vilkasliikkeinen kuusikko, joista jokaisella on lempinimensä
              ohella omat erityispiirteensä.
            </p>
            <p>
              Töppötassut asuvat saaressa ja saavat temmeltää vapaasti luonnossa. Heille sattuu
              ja tapahtuu aina.
            </p>
          </Reveal>

          <Reveal direction="up" delay={120}>
            <h2 className="section-title">Tutustu hahmoihin</h2>
          </Reveal>

          <div className="grid grid-3 character-grid">
            {characters.map((c, i) => (
              <Reveal direction={i % 2 === 0 ? "left" : "right"} delay={(i % 3) * 60} key={c.name}>
                <div className="card character-card">
                  <h3>{c.name}</h3>
                  <p className="muted">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal direction="up">
            <p>
              Jokainen seikkailu esitetään luvun mittaisena episodina. Osassa draama syntyy
              arkisista aineksista, kuten paikallisen aasin hotellivierailusta, yhteisestä
              kortinpeluusta tai jäätelömakujen valinnasta.
            </p>
            <p>
              Usein käänteet ovat kuitenkin hyvin lennokkaita, konkreettisestikin, kun päädytään
              koneen siivelle, hypätään laskuvarjoilla Etnan juurelle tai liu'utaan samaisen
              tulivuoren huipulta liukurilla alas.
            </p>
            <p>
              Juonenkäänteiden lomassa vahvistetaan keskinäistä ystävyyttä, opetellaan
              sosiaalisia selviytymistaitoja, sekä harjoitetaan oman mielen hallintaa kiperissä
              tilanteissa.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
