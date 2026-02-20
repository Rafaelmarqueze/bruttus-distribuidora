import styled, { keyframes, css } from 'styled-components';

// Definição da animação de pulo (bounce)
const bounce = keyframes`
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`;

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 1.5rem; /* bottom-6 do Tailwind */
  right: 1.5rem;  /* right-6 do Tailwind */
  background-color: #16a34a; /* bg-green-600 */
  color: white;
  border: none;
  border-radius: 9999px; /* rounded-full */
  padding: 10px; /* p-2.5 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  z-index: 40;

  /* Aplica a animação apenas se a prop $jump for verdadeira */
  ${(props) =>
    props.$jump &&
    css`
      animation: ${bounce} 1s infinite;
    `}

  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.9);
  }

  /* Ajuste para a imagem dentro do botão */
  img {
    display: block;
    width: 40px;
    height: 40px;
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
  }
`;