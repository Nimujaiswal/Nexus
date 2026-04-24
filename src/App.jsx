import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Cursor   from "./components/Cursor";
import Loader   from "./components/Loader";
import Navbar   from "./components/Navbar";
import Footer   from "./components/Footer";

import Home        from "./pages/Home";
import Games       from "./pages/Games";
import Features    from "./pages/Features";
import Story       from "./pages/Story";
import Leaderboard from "./pages/Leaderboard";
import Contact     from "./pages/Contact";
import Login       from "./pages/Login";
import Register    from "./pages/Register";
import NotFound    from "./pages/NotFound";
import Arcade      from "./pages/Arcade";

// Pages that skip the Navbar/Footer shell (full-screen auth layout)
const AUTH_ROUTES = ["/login", "/register"];

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ children }) {
  const { pathname } = useLocation();
  const isAuth = AUTH_ROUTES.includes(pathname);
  if (isAuth) return <>{children}</>;
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  return (
    <AuthProvider>
      {!ready && <Loader onDone={() => setReady(true)} />}

      {/* Cursor always rendered so co-ords are tracked from first paint */}
      <Cursor />

      {ready && (
        <BrowserRouter>
          <ScrollTop />
          <Layout>
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/games"       element={<Games />} />
              <Route path="/features"    element={<Features />} />
              <Route path="/story"       element={<Story />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/contact"     element={<Contact />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />
              <Route path="/arcade"      element={<Arcade />} />
              <Route path="*"            element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      )}
    </AuthProvider>
  );
}
