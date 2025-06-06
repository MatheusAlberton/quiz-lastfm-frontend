import React, { useState } from "react";
import OptionButton from "../components/OptionButton";
import "../styles/global.css";

function QuizPage({
  questionData,
  onNextQuestion,
  currentQuestionNumber,
  totalQuestions,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption) {
      onNextQuestion(selectedOption.isCorrect);
      setSelectedOption(null);
    } else {
      alert("Por favor, selecione uma opção antes de continuar.");
    }
  };

  return (
    <div className="page-container quiz-page">
      <div className="question-number">
        Pergunta {currentQuestionNumber} de {totalQuestions}
      </div>
      <h2 className="question-text">{questionData.question}</h2>
      <div className="options-container">
        {questionData.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={selectedOption && selectedOption.id === option.id}
            onClick={() => handleOptionClick(option)}
          />
        ))}
      </div>
      <button
        className="continue-button"
        onClick={handleContinue}
        disabled={!selectedOption}
      >
        CONTINUAR
      </button>
    </div>
  );
}

export default QuizPage;
