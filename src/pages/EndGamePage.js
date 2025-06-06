import React from "react";
import "../styles/global.css";

function EndGamePage({ score, totalQuestions, onRestartGame }) {
  return (
    <div className="page-container end-game-page">
      <h1>Quiz Concluído!</h1>
      <p>
        Sua pontuação final foi: {score} de {totalQuestions}
      </p>
      <button className="restart-button" onClick={onRestartGame}>
        Jogar Novamente
      </button>
    </div>
  );
}

export default EndGamePage;
