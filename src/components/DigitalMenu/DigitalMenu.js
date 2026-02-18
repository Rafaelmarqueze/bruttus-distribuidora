"use client";
import {
  DigitalMenuSection,
  ContentWrapper,
  LogosRow,
  Divider,
  CTAButton,
} from "./styles"
import Image from "next/image"

export default function DigitalMenu() {
  return (
    <DigitalMenuSection id="cardapio">
      <div className="container">
        <ContentWrapper>
          
          <LogosRow>
            <Image className="logo" src="/images/bruttusbg.png" width={150} height={150} alt="Darius Delivery" />
            <span>×</span>
            <Image className="darius" src="/images/darius.png" width={150} height={150} alt="Darius Delivery" />
          </LogosRow>

          <p className="subtitle">Clientes Bruttus agora têm</p>

          <h1>
            CARDÁPIO DIGITAL
            <span>100% GRATUITO</span>
          </h1>

          <Divider />

          <p className="muted">Enquanto outros vendem só carne...</p>

          <strong className="emphasis">
            A BRUTTUS ENTREGA ESTRUTURA.
          </strong>

          <CTAButton href="#contato">
            QUERO MEU CARDÁPIO GRÁTIS
          </CTAButton>

        </ContentWrapper>
      </div>
    </DigitalMenuSection>
  )
}
