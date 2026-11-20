import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import Reveal from "../components/Reveal.jsx";
import Lightbox from "../components/Lightbox.jsx";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    api
      .getGallery()
      .then(({ images }) => setImages(images))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <Reveal direction="up">
          <p className="section-eyebrow">Galleria</p>
          <h1 className="center">Kuvia</h1>
          <p className="section-lead">Klikkaa kuvaa nähdäksesi sen suurempana.</p>
        </Reveal>

        {loading && <div className="loading">Ladataan…</div>}
        {!loading && images.length === 0 && (
          <p className="empty-state">Kuvia ei ole vielä lisätty.</p>
        )}

        <div className="gallery-grid">
          {images.map((img, i) => (
            <Reveal
              as="figure"
              direction={i % 2 === 0 ? "left" : "right"}
              delay={(i % 4) * 60}
              className="gallery-item"
              key={img.id}
            >
              <button
                className="gallery-item-btn"
                onClick={() =>
                  setActive({ src: img.image_url, alt: img.caption || "Kuva", caption: img.caption })
                }
                aria-label="Suurenna kuva"
              >
                <img src={img.image_url} alt={img.caption || "Kuva"} />
              </button>
              {img.caption && <figcaption>{img.caption}</figcaption>}
            </Reveal>
          ))}
        </div>
      </div>

      <Lightbox image={active} onClose={() => setActive(null)} />
    </section>
  );
}
