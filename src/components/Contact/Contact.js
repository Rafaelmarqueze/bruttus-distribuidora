"use client";
import { useRouter } from 'next/navigation';
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

export default function Contact({ openModal = false, onCloseModal = () => { } }) {
  const router = useRouter();
  const [fullName, setFullName] = useState('')
  const [burgerPlaceName, setBurgerPlaceName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modal, setModal] = useState({ open: false, title: '', text: '' })

  const formatWhatsApp = (value) => {
    if (!value) return "";

    // Mantém apenas números
    const nums = value.replace(/\D/g, "");

    // Formatação: (XX) XXXXX-XXXX
    if (nums.length <= 2) return nums;
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;

    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`;
  };

  const handleCloseAllModals = () => {
    if (modal.title === 'Sucesso') {
      router.push('/agradecimento'); // Redireciona se foi sucesso
    }
    setModal({ open: false, title: '', text: '' });
    onCloseModal();
  };

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
          whatsapp: whatsapp.replace(/\D/g, ''),
          email,
          message
        })
      })

      if (!res.ok) {
        throw new Error('Failed')
      }

      setCnpj('')
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
                  // Aqui está o segredo: formata o valor antes de salvar no setWhatsapp
                  onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                  required
                  maxLength={15}
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
                    // Aqui está o segredo: formata o valor antes de salvar no setWhatsapp
                    onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                    required
                    maxLength={15}
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
