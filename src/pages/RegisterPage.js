import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Se o usuário já estiver logado, redireciona para a home
  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !password || !confirmPassword) {
      setMessage("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    // Chama a função de registro do contexto
    const result = await register(username, password);

    if (result.success) {
      setMessage(
        result.message || "Registro bem-sucedido! Agora você pode fazer login."
      );
      // Opcional: redirecionar para a página de login após o registro bem-sucedido
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redireciona após 2 segundos
    } else {
      setMessage(result.message || "Falha no registro. Tente novamente.");
    }
  };

  return (
    <div className="page-container auth-page">
      <h1 className="auth-title">Registrar</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Registrar
        </button>
      </form>
      {message && (
        <p
          className={`auth-message ${
            message.includes("sucesso") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
      <p className="auth-link-text">
        Já tem uma conta?{" "}
        <span onClick={() => navigate("/login")} className="auth-link">
          Faça login aqui
        </span>
      </p>
    </div>
  );
}

export default RegisterPage;
