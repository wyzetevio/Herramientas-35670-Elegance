import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Contact from './Pages/Contact';
import Login from "./Pages/Auth";
import Profile from "./Pages/Profile";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
