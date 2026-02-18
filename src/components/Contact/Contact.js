import { ContactSection, ContactGrid, Form, FormGroup, SocialLinks } from './styles'

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Implementar lógica de envio
  }

  return (
    <ContactSection id="contato">
      <div className="container">
        <h2>PRONTO PARA ELEVAR O PADRÃO DA SUA HAMBURGUERIA?</h2>
        <p>Fale com um de nossos consultores e descubra como a Bruttus pode transformar a qualidade dos seus hambúrgueres e impulsionar suas vendas.</p>

        <ContactGrid>
          <div>
            <h3>Informações de Contato</h3>
            
            <div className="contact-info">
              <h4>WhatsApp</h4>
              <p>+55 (11) 96324-9706</p>
            </div>

            <div className="contact-info">
              <h4>E-mail</h4>
              <p>contato@bruttusburg.com.br</p>
            </div>

            <SocialLinks>
              <h4>Redes Sociais</h4>
              <ul>
                <li><a href="https://wa.me/5511963249706">WhatsApp</a></li>
                <li><a href="https://t.me/hamburgueria">Telegram</a></li>
                <li><a href="https://instagram.com/hamburgueria">Instagram</a></li>
                <li><a href="https://facebook.com/hamburgueria">Facebook</a></li>
              </ul>
            </SocialLinks>
          </div>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="nome">NOME COMPLETO</label>
              <input type="text" id="nome" placeholder="Seu nome" required />
            </FormGroup>

            <FormGroup>
              <label htmlFor="empresa">NOME DA HAMBURGUERIA</label>
              <input type="text" id="empresa" placeholder="Sua empresa" required />
            </FormGroup>

            <FormGroup>
              <label htmlFor="whatsapp">WHATSAPP</label>
              <input type="tel" id="whatsapp" placeholder="(00) 0000-0000" required />
            </FormGroup>

            <FormGroup>
              <label htmlFor="email">E-MAIL</label>
              <input type="email" id="email" placeholder="seu@email.com" required />
            </FormGroup>

            <FormGroup>
              <label htmlFor="mensagem">MENSAGEM</label>
              <textarea id="mensagem" rows="4" placeholder="Como podemos ajudar?"></textarea>
            </FormGroup>

            <button type="submit">SOLICITAR CONTATO COMERCIAL</button>
          </Form>
        </ContactGrid>
      </div>
    </ContactSection>
  )
}