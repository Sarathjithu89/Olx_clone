import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/Auth/Auth.jsx";
import { ItemContextProvider } from "./context/Sellitems.jsx";
import { BrowserRouter } from "react-router-dom";
import { FavoritesProvider } from "./context/Favorites.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ItemContextProvider>
        <FavoritesProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </FavoritesProvider>
      </ItemContextProvider>
    </AuthProvider>
  </BrowserRouter>
);
