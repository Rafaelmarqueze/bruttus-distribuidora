"use client";
import styled from "styled-components";

const PurchaseHeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)),
    url("/images/blendbg.jpeg") center/cover no-repeat;
  background-attachment: fixed;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 60px 20px;
  position: relative;
`;

const PurchaseHeroContent = styled.div`
  max-width: 800px;
  z-index: 2;
  margin-right: 500px;
  text-align: left;

  h1 {
    font-size: 3.5rem;
    margin: 0 0 20px 0;
    font-weight: 900;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
    line-height: 1.2;

    span {
      color: #ff6b35;
    }

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.3rem;
    margin: 0 0 30px 0;
    font-weight: 300;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

export default function PurchaseHero() {
  return (
    <PurchaseHeroSection>
      <PurchaseHeroContent>
        <h1>
          NOSSA <span>QUALIDADE</span>
        </h1>
        <p>
          Carnes selecionadas, inspeção rigorosa e processos que
          garantem sabor, segurança e frescor em cada entrega.
        </p>
      </PurchaseHeroContent>
    </PurchaseHeroSection>
  );
}
