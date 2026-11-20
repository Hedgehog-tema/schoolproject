import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty-state">
      <h1>404</h1>
      <p>Sivua ei löytynyt.</p>
      <Link to="/" className="btn btn-primary btn-sm">
        Takaisin etusivulle
      </Link>
    </div>
  );
}
