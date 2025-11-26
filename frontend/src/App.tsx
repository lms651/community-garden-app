import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import GoogleLogin from "./pages/GoogleLogin";
import React from "react";
import type { User } from "./types/User";
import Profile from "./pages/Profile";

function App() {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <>
      <Router>
        <Header user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<GoogleLogin setUser={setUser} />} />
          <Route path="/profile" element={<Profile user={user} />} />

          {/* Future routes:
          <Route path="/my-trades" element={<MyTrades />} />
          <Route path="/trade-history" element={<TradeHistory />} />
          */}
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
