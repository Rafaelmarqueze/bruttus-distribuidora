import { DigitalMenuSection, ContentWrapper, Highlight, CTALink } from './styles'

export default function DigitalMenu() {
  return (
    <DigitalMenuSection id="cardapio">
      <div className="container">
        <ContentWrapper>
          <Highlight>EXCLUSIVO PARA CLIENTES BRUTTUS</Highlight>
          <h2>Clientes Bruttus agora têm <span>CARDÁPIO DIGITAL 100% GRATUITO</span></h2>
          
          <div className="highlight-box">
            <p>Enquanto outros vendem só carne...</p>
            <strong>A BRUTTUS ENTREGA ESTRUTURA.</strong>
          </div>

          <CTALink href="#contato">
            QUERO MEU CARDÁPIO GRÁTIS →
          </CTALink>

          <div className="partnership">
            <p>Em parceria com:</p>
            <span>DARÍUS DELIVERY</span>
          </div>
        </ContentWrapper>
      </div>
    </DigitalMenuSection>
  )
}