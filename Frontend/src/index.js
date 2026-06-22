import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./Context/CartContext";
import { AuthProvider } from "./Context/AuthContext";
import { AccessibilityProvider } from "./Context/AccessibilityContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <AccessibilityProvider>
          <App />
        </AccessibilityProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>,
);