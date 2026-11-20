import Reveal from "../components/Reveal.jsx";

export default function Contact() {
  return (
    <section className="section">
      <div className="container">
        <Reveal direction="up">
          <p className="section-eyebrow">Ota yhteyttä</p>
          <h1 className="center">Yhteystiedot</h1>
        </Reveal>

        <Reveal direction="up" delay={100}>
          <div className="card contact-card">
            <p>
              Kiinnostaako kouluvierailu, haastattelu tai yhteistyö? Ota rohkeasti yhteyttä —
              vastaan mielelläni!
            </p>
            <ul className="contact-list">
              <li>
                <strong>Sähköposti:</strong>{" "}
                <a href="mailto:taija.ruuhijarvi@hotmail.com">taija.ruuhijarvi@hotmail.com</a>
              </li>
              <li>
                <strong>Kustantaja:</strong> Momentum kirjat
              </li>
              <li>
                <strong>Sijainti:</strong> Turku, Suomi
              </li>
            </ul>
            <div className="footer-social">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.pinterest.com" target="_blank" rel="noreferrer">Pinterest</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
