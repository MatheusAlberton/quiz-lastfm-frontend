import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function ProfilePage() {
  const { user, updateUser, deleteUser, logout } = useAuth();
  const navigate = useNavigate();

  // Estados para os campos de atualização
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Estado para mostrar/esconder confirmação de exclusão

  // Carrega o nome de usuário atual ao montar o componente
  useEffect(() => {
    if (user) {
      setNewUsername(user.username);
    }
  }, [user]);

  // Redireciona se não houver usuário logado (garantia, embora PrivateRoute já faça isso)
  useEffect(() => {
    if (!user && !showDeleteConfirm) {
      // Evita redirecionar se o modal de delete estiver aberto e o user for null
      navigate("/login");
    }
  }, [user, navigate, showDeleteConfirm]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!currentPassword) {
      setMessage(
        "Por favor, digite sua senha atual para confirmar a atualização."
      );
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      setMessage("As novas senhas não coincidem.");
      return;
    }

    // Chama a função de atualização do contexto
    const result = await updateUser(currentPassword, newPassword, newUsername);

    if (result.success) {
      setMessage(result.message || "Perfil atualizado com sucesso!");
      setCurrentPassword(""); // Limpa campos de senha após sucesso
      setNewPassword("");
      setConfirmNewPassword("");
    } else {
      setMessage(result.message || "Falha na atualização do perfil.");
    }
  };

  const handleDeleteAccount = async () => {
    setMessage("");
    // Requer a senha atual para confirmar a exclusão
    const passwordConfirm = prompt(
      "Para confirmar a exclusão da sua conta, digite sua senha:"
    );
    if (!passwordConfirm) {
      setMessage("Exclusão cancelada.");
      return;
    }

    const result = await deleteUser(passwordConfirm);

    if (result.success) {
      setMessage(
        result.message || "Conta deletada com sucesso! Redirecionando..."
      );
      setShowDeleteConfirm(false); // Fecha o modal de confirmação
      setTimeout(() => {
        navigate("/register"); // Redireciona para registro após exclusão
      }, 1500);
    } else {
      setMessage(
        result.message ||
          "Falha ao deletar a conta. Senha incorreta ou erro no servidor."
      );
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redireciona para login após logout
  };

  if (!user) {
    return <div className="loading-screen">Redirecionando para login...</div>;
  }

  return (
    <div className="page-container auth-page">
      <h1 className="auth-title">Meu Perfil</h1>
      <p className="profile-welcome">Bem-vindo(a), {user.username}!</p>

      <form onSubmit={handleUpdate} className="auth-form">
        <h2 className="form-subtitle">Atualizar Dados</h2>
        <div className="form-group">
          <label htmlFor="newUsername">Novo Nome de Usuário:</label>
          <input
            type="text"
            id="newUsername"
            className="auth-input"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="currentPassword">
            Senha Atual (obrigatório para atualizar):
          </label>
          <input
            type="password"
            id="currentPassword"
            className="auth-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Nova Senha (opcional):</label>
          <input
            type="password"
            id="newPassword"
            className="auth-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirmar Nova Senha:</label>
          <input
            type="password"
            id="confirmNewPassword"
            className="auth-input"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="auth-button">
          Atualizar Perfil
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

      <div className="profile-actions">
        <button
          onClick={handleLogout}
          className="profile-action-button logout-button"
        >
          Sair
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="profile-action-button delete-button"
        >
          Deletar Conta
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-content">
            <p>
              Tem certeza que deseja deletar sua conta? Esta ação é
              irreversível.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="auth-button delete-button confirm"
            >
              Sim, Deletar
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="auth-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
