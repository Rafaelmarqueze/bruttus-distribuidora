import { useState } from 'react'
import { FAQSection, FAQList, FAQItem, Question, Answer } from './styles'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "Quais produtos a Bruttus oferece?",
      answer: "Oferecemos hambúrgueres moldados (ideais para agilidade e padronização) e blends resfriados (para quem busca controle total). Todos produzidos com carnes selecionadas e tecnologia de ponta."
    },
    {
      question: "Vocês atendem apenas hamburguerias?",
      answer: "Nosso foco principal são hamburguerias, mas também atendemos restaurantes, lanchonetes e outros estabelecimentos que buscam qualidade em seus burgers."
    },
    {
      question: "Como funciona a entrega?",
      answer: "Contamos com logística eficiente em todo território nacional. A entrega é rápida e segura, garantindo que o frescor chegue intacto à sua hamburgueria."
    },
    {
      question: "Como faço para me tornar um cliente?",
      answer: "Basta entrar em contato com um de nossos consultores através do formulário em nossa página ou pelos canais de atendimento. Faremos uma análise do seu negócio e apresentaremos as melhores soluções."
    },
    {
      question: "Como funciona a parceria com a Darius Delivery?",
      answer: "Clientes Bruttus têm acesso exclusivo ao cardápio digital 100% gratuito em parceria com a Darius Delivery, incluindo 30 dias grátis da plataforma completa."
    }
  ]

  return (
    <FAQSection id="faq">
      <div className="container">
        <h2>TIRE SUAS DÚVIDAS</h2>
        
        <FAQList>
          {faqs.map((faq, index) => (
            <FAQItem key={index}>
              <Question 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                isOpen={openIndex === index}
              >
                {faq.question}
                <span>{openIndex === index ? '−' : '+'}</span>
              </Question>
              <Answer isOpen={openIndex === index}>
                <p>{faq.answer}</p>
              </Answer>
            </FAQItem>
          ))}
        </FAQList>
      </div>
    </FAQSection>
  )
}