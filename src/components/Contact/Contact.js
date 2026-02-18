"use client";

import {
  ContactSection,
  ContactGrid,
  ContactInfo,
  Form,
  FormGroup
} from './styles'

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <ContactSection id="contato">
      <div className="container">
        <ContactGrid>
          
          {/* COLUNA ESQUERDA */}
          <ContactInfo>
            <h2>
              PRONTO PARA <span>ELEVAR O PADRÃO</span> DA SUA HAMBURGUERIA?
            </h2>

            <p>
              Fale com um de nossos consultores e descubra como a Bruttus pode
              transformar a qualidade dos seus hambúrgueres e impulsionar suas vendas.
            </p>

            <div className="info">
              <strong>WhatsApp</strong>
              <span>+55 (11) 99999-9999</span>
            </div>

            <div className="info">
              <strong>E-mail</strong>
              <span>comercial@bruttusdistribuidora.com.br</span>
            </div>

            <div className="info">
              <strong>Endereço</strong>
              <span>São Paulo - SP</span>
            </div>
          </ContactInfo>

          {/* COLUNA DIREITA */}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label>NOME COMPLETO</label>
              <input placeholder="Seu nome" />
            </FormGroup>

            <FormGroup>
              <label>NOME DA HAMBURGUERIA</label>
              <input placeholder="Sua empresa" />
            </FormGroup>

            <div className="row">
              <FormGroup>
                <label>WHATSAPP</label>
                <input placeholder="(00) 00000-0000" />
              </FormGroup>

              <FormGroup>
                <label>E-MAIL</label>
                <input placeholder="seu@email.com" />
              </FormGroup>
            </div>

            <FormGroup>
              <label>MENSAGEM</label>
              <textarea placeholder="Como podemos ajudar?" />
            </FormGroup>

            <button type="submit">
              SOLICITAR CONTATO COMERCIAL
            </button>
          </Form>

        </ContactGrid>
      </div>
    </ContactSection>
  )
}
