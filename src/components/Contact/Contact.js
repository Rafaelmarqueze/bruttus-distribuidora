"use client";

import { useState } from 'react'

import {
  ContactSection,
  ContactGrid,
  ContactInfo,
  Form,
  FormGroup,
  ModalOverlay,
  ModalContent
} from './styles'

export default function Contact() {
  const [fullName, setFullName] = useState('')
  const [burgerPlaceName, setBurgerPlaceName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modal, setModal] = useState({ open: false, title: '', text: '' })

  const submit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          burgerPlaceName,
          whatsapp,
          email,
          message
        })
      })

      if (!res.ok) {
        throw new Error('Failed')
      }

      setFullName('')
      setBurgerPlaceName('')
      setWhatsapp('')
      setEmail('')
      setMessage('')
      setModal({
        open: true,
        title: 'Sucesso',
        text: 'Contato enviado com sucesso! Em breve um consultor entrará em contato.'
      })
    } catch (err) {
      setModal({
        open: true,
        title: 'Erro',
        text: 'Não foi possível enviar agora. Tente novamente.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ContactSection id="contato">
      {modal.open && (
        <ModalOverlay
          role="dialog"
          aria-modal="true"
          onClick={() => setModal({ open: false, title: '', text: '' })}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{modal.title}</h3>
            <p>{modal.text}</p>
            <div className="actions">
              <button
                type="button"
                className='text-white'
                onClick={() => setModal({ open: false, title: '', text: '' })}
              >
                Fechar
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

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
              <span>+55 (11) 96324-9706</span>
            </div>

            <div className="info">
              <strong>E-mail</strong>
              <span>bruttusfornecedor@gmail.com</span>
            </div>
          </ContactInfo>

          {/* COLUNA DIREITA */}
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <FormGroup>
              <label>NOME COMPLETO</label>
              <input
                placeholder="Seu nome"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>NOME DA HAMBURGUERIA</label>
              <input
                placeholder="Sua empresa"
                value={burgerPlaceName}
                onChange={(e) => setBurgerPlaceName(e.target.value)}
              />
            </FormGroup>

            <div className="row">
              <FormGroup>
                <label>WHATSAPP</label>
                <input
                  placeholder="(00) 00000-0000"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>E-MAIL</label>
                <input
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </FormGroup>
            </div>

            <FormGroup>
              <label>MENSAGEM</label>
              <textarea
                placeholder="Como podemos ajudar?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </FormGroup>

            <button type="submit" disabled={isSubmitting}>
              SOLICITAR CONTATO COMERCIAL
            </button>
          </Form>

        </ContactGrid>
      </div>
    </ContactSection>
  )
}
