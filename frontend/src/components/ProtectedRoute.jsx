import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Ladataan…</div>;
  }

  if (!user) {
    return <Navigate to="/kirjaudu" state={{ from: location }} replace />;
  }

  return children;
}
