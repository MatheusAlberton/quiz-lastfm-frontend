import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function LoginPage() {
  // Hook personalizado para acessar as funções de autenticação
  const { login, user } = useAuth();
  // Hook para navegação programática
  const navigate = useNavigate();

  // Estados para os campos do formulário
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Estado para mensagens de feedback ao usuário
  const [message, setMessage] = useState("");

  // Se o usuário já estiver logado, redireciona para a home
  // Isso é importante para evitar que um usuário logado acesse a página de login
  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]); // Dependências: user e navigate para re-executar se eles mudarem

  // Função que lida com o envio do formulário de login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    setMessage(""); // Limpa mensagens anteriores

    // Verifica se os campos não estão vazios
    if (!username || !password) {
      setMessage("Por favor, preencha todos os campos.");
      return;
    }

    // Chama a função de login do contexto de autenticação
    const result = await login(username, password);

    if (result.success) {
      // Se o login for bem-sucedido, navega para a página inicial
      navigate("/");
    } else {
      // Caso contrário, exibe a mensagem de erro retornada pelo contexto
      setMessage(
        result.message || "Falha no login. Verifique suas credenciais."
      );
    }
  };

  return (
    <div className="page-container auth-page">
      <h1 className="auth-title">Login</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required // Campo obrigatório
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
            required // Campo obrigatório
          />
        </div>
        <button type="submit" className="auth-button">
          Entrar
        </button>
      </form>
      {message && <p className="auth-message error">{message}</p>}{" "}
      {/* Exibe mensagens de erro ou sucesso */}
      <p className="auth-link-text">
        Não tem uma conta?{" "}
        <span onClick={() => navigate("/register")} className="auth-link">
          Registre-se aqui
        </span>
      </p>
    </div>
  );
}

export default LoginPage;
