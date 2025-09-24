import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/Auth/Auth.jsx";
import { ItemContextProvider } from "./context/Sellitems.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ItemContextProvider>
      <AuthProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </AuthProvider>
    </ItemContextProvider>
  </BrowserRouter>
);
