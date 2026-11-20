import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import Reveal from "../components/Reveal.jsx";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBlogPosts()
      .then(({ posts }) => setPosts(posts))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <Reveal direction="up">
          <p className="section-eyebrow">Blogi</p>
          <h1 className="center">Uutisia ja ajatuksia</h1>
        </Reveal>

        {loading && <div className="loading">Ladataan…</div>}
        {!loading && posts.length === 0 && (
          <p className="empty-state">Ei vielä julkaistuja artikkeleita.</p>
        )}

        <div className="grid grid-2">
          {posts.map((p, i) => (
            <Reveal direction={i % 2 === 0 ? "left" : "right"} key={p.id}>
              <Link to={`/blog/${p.slug}`} className="card news-card">
                {p.cover_image_url && <img src={p.cover_image_url} alt={p.title} />}
                <h3>{p.title}</h3>
                <p className="muted">{p.excerpt}</p>
                <p className="muted" style={{ fontSize: "0.8rem" }}>
                  {new Date(p.published_at).toLocaleDateString("fi-FI")}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
