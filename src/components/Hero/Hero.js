import { HeroSection, HeroContent, Title, Subtitle, CTAButton } from './styles'

export default function Hero() {
  return (
    <HeroSection>
      <div className="container">
        <HeroContent>
          <Subtitle>DISTRIBUIDORA PREMIUM</Subtitle>
          <Title>
            BRUTTUS: A QUALIDADE QUE <span>TRANSFORMA SUA HAMBURGUERIA</span>
          </Title>
          <p>
            Seja nosso parceiro e leve não apenas os melhores blends de hambúrguer, 
            mas também cardápio digital completo por 30 dias grátis.
          </p>
          <CTAButton href="#contato">QUERO SER PARCEIRO →</CTAButton>
        </HeroContent>
      </div>
    </HeroSection>
  )
}