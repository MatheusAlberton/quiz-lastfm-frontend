import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext"; // Importar o hook de tema
import "../styles/global.css";

function HomePage({ onStartGame }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Obter o tema atual e a função de alternância
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/quiz");
    onStartGame();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="page-container home-page">
      {/* Botão de alternar tema */}
      <button onClick={toggleTheme} className="theme-toggle-button">
        {theme === "light" ? "🌙 Modo Escuro" : "☀️ Modo Claro"}
      </button>

      {user ? (
        <>
          <p className="welcome-message">Bem-vindo(a), {user.username}!</p>
          <h1 className="home-title">Quiz Musical!</h1>
          <p className="home-subtitle">
            Teste seus conhecimentos sobre música.
          </p>
          <button className="start-button" onClick={handleStartQuiz}>
            Começar Quiz
          </button>
          <div className="home-links">
            <span onClick={() => navigate("/profile")} className="auth-link">
              Meu Perfil
            </span>
            <span onClick={handleLogout} className="auth-link">
              Sair
            </span>
          </div>
        </>
      ) : (
        <>
          <h1 className="home-title">Bem-vindo ao Quiz Musical!</h1>
          <p className="home-subtitle">
            Teste seus conhecimentos sobre música.
          </p>
          <div className="home-links">
            <span onClick={() => navigate("/login")} className="auth-link">
              Fazer Login
            </span>
            <span onClick={() => navigate("/register")} className="auth-link">
              Registrar
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
