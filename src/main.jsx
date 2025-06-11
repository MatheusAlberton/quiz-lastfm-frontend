import React from "react";
import { createRoot } from "react-dom/client"; // Importação correta do createRoot
import App from "./App.jsx"; // Ou './App.jsx' se você nomeou assim
import "./styles/global.css";

// Apenas uma única chamada para criar e renderizar a raiz do seu aplicativo
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
