import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Book from "./pages/Book.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";
import Orders from "./pages/Orders.jsx";
import Materials from "./pages/Materials.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kuka-mina-olen" element={<Navigate to="/#kuka-mina-olen" replace />} />
          <Route path="/toppotassut" element={<Book />} />
          <Route path="/kuvia" element={<Gallery />} />
          <Route path="/yhteystiedot" element={<Contact />} />
          <Route path="/tilaukset" element={<Orders />} />
          <Route path="/materiaalit" element={<Materials />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/kirjaudu" element={<Login />} />
          <Route path="/rekisteroidy" element={<Register />} />
          <Route
            path="/oma-tili"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
