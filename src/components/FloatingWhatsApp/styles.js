import styled from 'styled-components'

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.5);
  }

  svg {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 55px;
    height: 55px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`
