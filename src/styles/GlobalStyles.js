import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.primary};
    background: ${({ theme }) => theme.colors.light};
    color: ${({ theme }) => theme.colors.dark};
    line-height: 1.6;
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ul, ol {
    list-style: none;
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      padding: 0 1.5rem;
    }
  }

  /* Container principal que ocupa a tela toda */
.agradecimento-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background-color: #520109; /* Sua cor personalizada */
  color: white;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
}

/* Título Darius */
.brand-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

/* Container da Imagem para controlar o tamanho */
.logo-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 2rem;
}

/* Bloco de textos */
.text-content {
  max-width: 500px;
  margin-bottom: 2.5rem;
}

.text-content h2 {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.text-content p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Botão Estilo WhatsApp */
.btn-whatsapp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: #25D366; /* Verde WhatsApp */
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 18px 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-whatsapp:hover {
  transform: scale(1.02);
  background-color: #20ba5a;
}

/* Rodapé */
.footer-text {
  margin-top: 2rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}
`

export default GlobalStyles