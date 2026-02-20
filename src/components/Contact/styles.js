import styled from 'styled-components'

export const ContactSection = styled.section`
  padding: 6rem 0;
  background: radial-gradient(
    circle at center,
    #1c1c1c 0%,
    #0f0f0f 70%
  );
  color: white;
`

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

/* COLUNA ESQUERDA */
export const ContactInfo = styled.div`
  h2 {
    font-size: 2.6rem;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 1.5rem;

    span {
      color: #ffffff;
    }

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    opacity: 0.8;
    max-width: 420px;
    margin-bottom: 2.5rem;
  }

  .info {
    margin-bottom: 1.5rem;

    strong {
      display: block;
      font-size: 0.85rem;
      text-transform: uppercase;
      opacity: 0.7;
      margin-bottom: 0.25rem;
    }

    span {
      font-size: 1rem;
    }
  }
`

export const InfoLink = styled.a`
  display: block;
  margin-bottom: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: 0.3s;

  strong {
    display: block;
    font-size: 0.85rem;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 0.25rem;
  }

  span {
    font-size: 1rem;
    display: block;
  }

  &:hover {
    opacity: 0.8;
    color: #fb2c36;

    strong {
      opacity: 1;
    }
  }
`

/* FORMULÁRIO */
export const Form = styled.form`
  background: #161616;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(0,0,0,0.4);

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  button {
    width: 100%;
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 12px;
    background: white;
    color: black;
    font-weight: 800;
    border: none;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }
  }
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;

  label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: white;
    margin-bottom: 0.4rem;
  }

  input,
  textarea {
    background: #101010;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    padding: 0.75rem;
    color: white;
    font-size: 0.95rem;

    &::placeholder {
      color: #666;
    }

    &:focus {
      outline: none;
      border-color: #fb2c36;
    }
  }

  textarea {
    resize: none;
    min-height: 100px;
  }
`

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 9999;
`

export const ModalContent = styled.div`

  h3 {
    color: white;
  }
    
  width: 100%;
  max-width: 520px;
  background: #161616;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);

  h3 {
    margin: 0 0 1rem 0;
    font-weight: 900;
    font-size: 1.25rem;
  }

  p {
    margin: 0;
    opacity: 0.85;
    color: white;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.25rem;
    gap: 0.75rem;
  }

  button {
    width: auto;
    margin-top: 0;
    padding: 0.85rem 1.25rem;
    border-radius: 12px;
    background: #101010;
    color: white;
    font-weight: 800;
    border: 1px solid #2a2a2a;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }
`

export const ModalForm = styled.form`
  width: 100%;

  button {
    width: 100%;
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 12px;
    background: white;
    color: black;
    font-weight: 800;
    border: none;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`