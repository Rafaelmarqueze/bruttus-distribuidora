"use client";
import { HeroSection, HeroContent, Title, Subtitle, CTAButton } from './styles'

export default function Hero() {
  return (
    <HeroSection>
      <div className="container">
        <HeroContent>
          <Subtitle>FORNECEDOR DE HAMBÚRGUER</Subtitle>
          <Title>
            HAMBÚRGUER DE QUALIDADE COM O <span>PREÇO</span> QUE VOCÊ TANTO PROCURA.
          </Title>
          <p>
            Aumente sua margem de lucro sem abrir mão do sabor. <b>Clique no botão verde do WhatsApp e faça sua cotação.</b>
          </p>
          <CTAButton href="#contato">QUERO SER PARCEIRO →</CTAButton>
        </HeroContent>
      </div>
    </HeroSection>
  )
}