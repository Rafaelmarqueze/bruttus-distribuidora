"use client";

import { useState } from 'react'

import {
  ContactSection,
  ContactGrid,
  ContactInfo,
  Form,
  FormGroup,
  ModalOverlay,
  ModalContent,
  InfoLink,
  ModalForm
} from './styles'

export default function Contact({ openModal = false, onCloseModal = () => {} }) {
  const [fullName, setFullName] = useState('')
  const [burgerPlaceName, setBurgerPlaceName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modal, setModal] = useState({ open: false, title: '', text: '' })

  const handleCloseAllModals = () => {
    setModal({ open: false, title: '', text: '' })
    onCloseModal()
  }

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

  const handleSubmitFromModal = async (e) => {
    e.preventDefault()
    await submit()
  }

  return (
    <>
      {/* Modal com mensagens de sucesso/erro */}
      {modal.open && (
        <ModalOverlay
          role="dialog"
          aria-modal="true"
          onClick={handleCloseAllModals}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{modal.title}</h3>
            <p>{modal.text}</p>
            <div className="actions">
              <button
                type="button"
                className='success-button'
                onClick={handleCloseAllModals}
              >
                Fechar
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal com formulário (botão flutuante) */}
      {openModal && !modal.open && (
        <ModalOverlay
          role="dialog"
          aria-modal="true"
          onClick={handleCloseAllModals}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>SOLICITAR CONTATO</h3>
            <ModalForm
              onSubmit={handleSubmitFromModal}
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
            </ModalForm>
          </ModalContent>
        </ModalOverlay>
      )}

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

              <InfoLink href="https://wa.me/5511963249706" target="_blank" rel="noopener noreferrer">
                <strong>WhatsApp</strong>
                <span>+55 (11) 96324-9706</span>
              </InfoLink>

              <InfoLink href="mailto:bruttusfornecedor@gmail.com">
                <strong>E-mail</strong>
                <span>bruttusfornecedor@gmail.com</span>
              </InfoLink>
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
    </>
  )
}
