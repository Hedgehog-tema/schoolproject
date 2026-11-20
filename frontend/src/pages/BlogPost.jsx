import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client.js";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setPost(null);
    setError("");
    api
      .getBlogPost(slug)
      .then(({ post }) => setPost(post))
      .catch(() => setError("Artikkelia ei löytynyt."));
  }, [slug]);

  if (error) {
    return (
      <div className="empty-state">
        <p>{error}</p>
        <Link to="/blog" className="btn btn-outline btn-sm">
          Takaisin blogiin
        </Link>
      </div>
    );
  }

  if (!post) return <div className="loading">Ladataan…</div>;

  return (
    <section className="section">
      <div className="container blog-post">
        <Link to="/blog" className="muted">
          ← Takaisin blogiin
        </Link>
        <h1>{post.title}</h1>
        <p className="muted">{new Date(post.published_at).toLocaleDateString("fi-FI")}</p>
        {post.cover_image_url && <img src={post.cover_image_url} alt={post.title} />}
        <div className="blog-post-content">
          {post.content.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {post.source_url && (
          <a
            href={post.source_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary blog-post-source"
          >
            Lue koko juttu{post.source_label ? ` – ${post.source_label}` : ""} →
          </a>
        )}
      </div>
    </section>
  );
}
