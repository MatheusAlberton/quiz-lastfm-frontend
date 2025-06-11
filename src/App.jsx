import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import EndGamePage from "./pages/EndGamePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext"; // Importar ThemeProvider
import "./styles/global.css";

// Componente para proteger rotas que exigem autenticação
const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Carregando autenticação...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// NOVO COMPONENTE: AppContent (mantido como está, mas agora será envolvido pelo ThemeProvider)
function AppContent() {
  // Estados do quiz
  const [gameState, setGameState] = React.useState("home");
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);

  const navigate = useNavigate();

  const questions = [
    {
      question: "Qual foi o seu artista/banda mais escutado da semana?",
      options: [
        { id: "A", text: "Matuê", isCorrect: true },
        { id: "B", text: "Nirvana", isCorrect: false },
        { id: "C", text: "Luan Santana", isCorrect: false },
      ],
    },
    {
      question: "Qual é o álbum mais vendido de todos os tempos?",
      options: [
        { id: "A", text: "Thriller - Michael Jackson", isCorrect: true },
        {
          id: "B",
          text: "The Dark Side of the Moon - Pink Floyd",
          isCorrect: false,
        },
        { id: "C", text: "Back in Black - AC/DC", isCorrect: false },
      ],
    },
  ];

  const handleStartGame = () => {
    setGameState("playing");
    setCurrentQuestionIndex(0);
    setScore(0);
    navigate("/quiz");
  };

  const handleNextQuestion = (isCorrect) => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setGameState("end");
      navigate("/endgame");
    }
  };

  const handleRestartGame = () => {
    setGameState("home");
    navigate("/");
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage onStartGame={handleStartGame} />} />

        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <QuizPage
                questionData={questions[currentQuestionIndex]}
                onNextQuestion={handleNextQuestion}
                currentQuestionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/endgame"
          element={
            <PrivateRoute>
              <EndGamePage
                score={score}
                totalQuestions={questions.length}
                onRestartGame={handleRestartGame}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* ThemeProvider deve envolver AuthProvider e AppContent */}
      <ThemeProvider>
        <AuthProvider>
          <AppContent />{" "}
          {/* AppContent renderiza o conteúdo principal e usa useAuth/useNavigate */}
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
