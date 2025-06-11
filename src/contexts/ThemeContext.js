import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Criação do Contexto de Tema
const ThemeContext = createContext();

// 2. Provedor de Tema (ThemeProvider)
export const ThemeProvider = ({ children }) => {
  // Estado para armazenar o tema atual, inicializando com 'light' ou do localStorage
  const [theme, setTheme] = useState(() => {
    // Tenta obter o tema salvo no localStorage ou usa 'light' como padrão
    const savedTheme = localStorage.getItem("app-theme");
    return savedTheme ? savedTheme : "light";
  });

  // Efeito para aplicar a classe 'dark' ao <body> e salvar o tema no localStorage
  useEffect(() => {
    const root = window.document.documentElement; // html element
    const body = window.document.body; // body element

    // Remove classes de tema anteriores
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");

    // Adiciona a classe correspondente ao <html> e ao <body>
    root.classList.add(theme);
    body.classList.add(theme);

    // Salva o tema no localStorage para persistência
    localStorage.setItem("app-theme", theme);
  }, [theme]); // Este efeito roda sempre que o estado 'theme' muda

  // Função para alternar entre 'light' e 'dark'
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // O componente ThemeContext.Provider envolve seus 'children' e passa o objeto 'value'.
  // QUALQUER COMPONENTE FILHO OU DESCENDENTE PODERÁ ACESSAR ESTE 'value' USANDO 'useContext(ThemeContext)'.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider> // <-- CORREÇÃO AQUI: ERA </AuthContext.Provider>
  );
};

// 3. Hook Personalizado para Usar o Contexto de Tema (useTheme)
// Este é um Hook customizado que simplifica a forma como os componentes consomem o ThemeContext.
// Em vez de escrever 'useContext(ThemeContext)' em cada lugar, basta importar e usar 'useTheme()'.
export const useTheme = () => {
  return useContext(ThemeContext);
};
