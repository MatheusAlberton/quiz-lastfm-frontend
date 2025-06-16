import React, { createContext, useContext, useState, useEffect } from "react";
import localforage from "localforage"; // Para persistência local do token (ainda útil)
import axios from "axios"; // <-- Importar Axios

// 1. Criação do Contexto de Autenticação
const AuthContext = createContext();

// 2. Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- CONFIGURAÇÃO DA URL BASE DO BACKEND ---
  // Converse com seu amigo do back-end para obter a URL correta do servidor dele.
  // Pode ser algo como 'http://localhost:3001' ou 'https://api.seuservidor.com'
  const API_BASE_URL = "http://localhost:3001"; // <-- ALtere ESTA URL para a do seu backend!

  // Função auxiliar para configurar o Axios com o token
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Interceptor para adicionar o token JWT a cada requisição, se existir
  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Efeito para carregar o token do armazenamento local e validar com o backend ao iniciar
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await localforage.getItem("authToken");
        if (storedToken) {
          setToken(storedToken);
          // Tenta validar o token com o backend para obter os dados reais do usuário
          const response = await axiosInstance.get("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`, // Envia o token para validação
            },
          });
          setUser(response.data.user); // Assume que o backend retorna { user: { id, username, email } }
        }
      } catch (error) {
        console.error("Erro ao carregar/validar dados de autenticação:", error);
        // Se o token for inválido/expirado ou houver erro, limpa o token e força logout
        await localforage.removeItem("authToken");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthData();
  }, []); // Dependência vazia: roda apenas uma vez na montagem

  // Função de Login
  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        username,
        password,
      });
      const { token: fetchedToken, user: userData } = response.data; // Assume que o backend retorna 'token' e 'user'

      await localforage.setItem("authToken", fetchedToken);
      setToken(fetchedToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error(
        "Erro no login:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Falha no login. Verifique suas credenciais.",
      };
    }
  };

  // Função de Logout
  const logout = async () => {
    try {
      // Opcional: Se o backend tiver um endpoint para invalidar tokens no servidor
      // await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.warn(
        "Erro ao tentar logout no backend (token já pode estar inválido):",
        error
      );
    } finally {
      await localforage.removeItem("authToken");
      setToken(null);
      setUser(null);
    }
  };

  // Função de Registro (Create - Usuário)
  const register = async (username, password) => {
    try {
      const response = await axiosInstance.post("/api/auth/register", {
        username,
        password,
      });
      return {
        success: true,
        message:
          response.data.message ||
          "Usuário registrado com sucesso! Por favor, faça login.",
      };
    } catch (error) {
      console.error(
        "Erro no registro:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Falha no registro. Tente novamente.",
      };
    }
  };

  // Função de Update (Alterar Senha/Dados)
  const updateUser = async (currentPassword, newPassword, newUsername) => {
    try {
      // Os dados enviados devem corresponder ao que o backend espera
      const updateData = { currentPassword };
      if (newPassword) {
        updateData.newPassword = newPassword;
      }
      if (newUsername) {
        updateData.username = newUsername; // Supondo que o backend espera 'username' para alteração
      }

      const response = await axiosInstance.put("/api/users/me", updateData);

      // Assume que o backend retorna os dados atualizados do usuário ou uma mensagem
      if (response.data.user) {
        setUser(response.data.user); // Atualiza o estado do usuário com os novos dados
      } else {
        setUser((prevUser) => ({
          ...prevUser,
          username: newUsername || prevUser.username,
        })); // Se o backend não retornar user completo
      }
      return {
        success: true,
        message: response.data.message || "Dados atualizados com sucesso!",
      };
    } catch (error) {
      console.error(
        "Erro na atualização:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message:
          error.response?.data?.message || "Falha na atualização do perfil.",
      };
    }
  };

  // Função de Delete (Deletar Conta)
  const deleteUser = async (password) => {
    try {
      await axiosInstance.delete("/api/users/me", { data: { password } }); // DELETE com body requer 'data' no Axios
      await logout(); // Desloga o usuário após sucesso na exclusão
      return { success: true, message: "Conta deletada com sucesso!" };
    } catch (error) {
      console.error(
        "Erro ao deletar conta:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Falha ao deletar a conta. Senha incorreta ou erro no servidor.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        register,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook Personalizado para Usar o Contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
