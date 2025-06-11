import React, { createContext, useContext, useState, useEffect } from "react";
import localforage from "localforage"; // Para simular armazenamento de token

// 1. Criação do Contexto
const AuthContext = createContext();

// 2. Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Armazena informações do usuário logado (ex: { id: '1', username: 'Matheus' })
  const [token, setToken] = useState(null); // Armazena o token de autenticação
  const [isLoading, setIsLoading] = useState(true); // Para verificar se já tentamos carregar o token

  // Efeito para carregar o token e o usuário do armazenamento local ao iniciar a aplicação
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await localforage.getItem("authToken");
        if (storedToken) {
          setToken(storedToken);
          // Em uma aplicação real, você faria uma requisição para o backend
          // para validar o token e obter os dados do usuário.
          // Por simplicidade aqui, vamos simular que o token indica um usuário logado.
          // Você pode decodificar o JWT aqui para pegar o username, se for o caso.
          setUser({ username: "Usuário Teste" }); // Simulando um usuário logado
        }
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthData();
  }, []);

  // Função de Login
  const login = async (username, password) => {
    // Aqui você faria a chamada para o backend para autenticar
    // Ex: const response = await axios.post('/api/login', { username, password });
    // const fetchedToken = response.data.token;
    // const userData = response.data.user;

    // SIMULAÇÃO DE LOGIN BEM SUCEDIDO
    if (username === "test" && password === "123") {
      const fetchedToken = "fake-jwt-token-123"; // Token de exemplo
      await localforage.setItem("authToken", fetchedToken);
      setToken(fetchedToken);
      setUser({ id: "1", username: username });
      return { success: true };
    } else {
      return { success: false, message: "Usuário ou senha inválidos" };
    }
  };

  // Função de Logout
  const logout = async () => {
    await localforage.removeItem("authToken");
    setToken(null);
    setUser(null);
  };

  // Função de Registro (Create - Usuário)
  const register = async (username, password) => {
    // Aqui você faria a chamada para o backend para registrar o usuário
    // Ex: const response = await axios.post('/api/register', { username, password });
    // if (response.status === 201) { ... }

    // SIMULAÇÃO DE REGISTRO BEM SUCEDIDO
    if (username && password) {
      // Em uma aplicação real, você não armazenaria a senha no front-end.
      // Apenas simula que o registro cria uma conta.
      console.log("Usuário registrado:", username, "Senha:", password);
      return { success: true, message: "Usuário registrado com sucesso!" };
    } else {
      return { success: false, message: "Preencha todos os campos." };
    }
  };

  // Função de Update (Alterar Senha/Dados)
  const updateUser = async (currentPassword, newPassword, newUsername) => {
    // Aqui você faria a chamada para o backend para atualizar os dados do usuário
    // Ex: const response = await axios.put('/api/users/me', { currentPassword, newPassword, newUsername }, { headers: { Authorization: `Bearer ${token}` } });

    // SIMULAÇÃO DE UPDATE BEM SUCEDIDO
    if (token && user) {
      if (currentPassword === "123") {
        // Simula validação da senha atual
        setUser((prevUser) => ({
          ...prevUser,
          username: newUsername || prevUser.username,
        }));
        console.log(
          "Dados do usuário atualizados. Nova senha (apenas simulação):",
          newPassword
        );
        return { success: true, message: "Dados atualizados com sucesso!" };
      } else {
        return { success: false, message: "Senha atual incorreta." };
      }
    }
    return { success: false, message: "Não autenticado." };
  };

  // Função de Delete (Deletar Conta)
  const deleteUser = async (password) => {
    // Aqui você faria a chamada para o backend para deletar o usuário
    // Ex: const response = await axios.delete('/api/users/me', { data: { password }, headers: { Authorization: `Bearer ${token}` } });

    // SIMULAÇÃO DE DELETE BEM SUCEDIDO
    if (token && user) {
      if (password === "123") {
        // Simula validação da senha para deletar
        await logout(); // Desloga o usuário após deletar a conta
        return { success: true, message: "Conta deletada com sucesso!" };
      } else {
        return {
          success: false,
          message: "Senha incorreta para deletar a conta.",
        };
      }
    }
    return { success: false, message: "Não autenticado." };
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
