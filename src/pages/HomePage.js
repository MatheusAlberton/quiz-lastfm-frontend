import React from 'react';
import '../styles/global.css'; // Importe o arquivo de estilos global

function HomePage({ onStartGame }) {
return (
    <div className="page-container home-page">
    <h1>Bem-vindo ao Quiz Musical!</h1>
    <p>Teste seus conhecimentos sobre música.</p>
    <button className="start-button" onClick={onStartGame}>
        Começar Jogo
    </button>
    </div>
);
}

export default HomePage;