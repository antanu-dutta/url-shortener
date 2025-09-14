import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext.jsx";
import { UrlProvider } from "./context/UrlContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <UrlProvider>
          <App />
        </UrlProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
