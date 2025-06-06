import React, { useState } from 'react';
import HomePage from './pages/HomePage.js';
import QuizPage from './pages/QuizPage.js';
import EndGamePage from './pages/EndGamePage.js';
import './styles/global.css';

function App() {
  const [gameState, setGameState] = useState('home'); // 'home', 'playing', 'end'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Exemplo de perguntas (você vai substituir isso com os dados da API Last.fm)
  const questions = [
    {
      question: "Qual foi o seu artista/banda mais escutado da semana?",
      options: [
        { id: 'A', text: "Matuê", isCorrect: true },
        { id: 'B', text: "Nirvana", isCorrect: false },
        { id: 'C', text: "Luan Santana", isCorrect: false },
      ],
    },
    {
      question: "Qual é o álbum mais vendido de todos os tempos?",
      options: [
        { id: 'A', text: "Thriller - Michael Jackson", isCorrect: true },
        { id: 'B', text: "The Dark Side of the Moon - Pink Floyd", isCorrect: false },
        { id: 'C', text: "Back in Black - AC/DC", isCorrect: false },
      ],
    },
    // Adicione mais perguntas aqui
  ];

  const handleStartGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const handleNextQuestion = (isCorrect) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setGameState('end');
    }
  };

  const handleRestartGame = () => {
    setGameState('home');
  };

  return (
    <div className="app-container">
      {gameState === 'home' && <HomePage onStartGame={handleStartGame} />}
      {gameState === 'playing' && (
        <QuizPage
          questionData={questions[currentQuestionIndex]}
          onNextQuestion={handleNextQuestion}
          currentQuestionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      )}
      {gameState === 'end' && (
        <EndGamePage
          score={score}
          totalQuestions={questions.length}
          onRestartGame={handleRestartGame}
        />
      )}
    </div>
  );
}

export default App;
