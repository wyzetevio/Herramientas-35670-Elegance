import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Catalog from "./Pages/Catalog";
import Cart from "./Pages/Cart";
import Login from "./Pages/Auth";
import Profile from "./Pages/Profile";
import Claims from "./Pages/Claims";
import Admin from "./Pages/Admin";
import AdminRoute from "./Components/AdminRoute";
import MyOrders from "./Pages/MyOrders";
import AccessibilityPanel from "./Components/AccessibilityPanel";


function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="flex-grow-1">
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/claims" element={<Claims />} />
        </Routes>
      </div>
      <Footer />
      <AccessibilityPanel />
    </div>
  );
}

export default App;
