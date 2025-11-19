import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import GoogleLogin from "./pages/GoogleLogin";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<GoogleLogin />} />
          {/* <Route path="/home" element={<UserHomePage />} />
          <Route path="/neighbor/:id" element={<NeighborPage />} />
          <Route path="/trades" element={<MyTradesPage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} /> */}
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
