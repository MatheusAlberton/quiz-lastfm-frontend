import React from "react";
import "../styles/global.css"; // Importe o arquivo de estilos global

function OptionButton({ option, isSelected, onClick }) {
  const buttonClassName = `option-button ${isSelected ? "selected" : ""}`;

  return (
    <button className={buttonClassName} onClick={onClick}>
      <span className="option-id">{option.id}</span>
      <span className="option-text">{option.text}</span>
    </button>
  );
}

export default OptionButton;
