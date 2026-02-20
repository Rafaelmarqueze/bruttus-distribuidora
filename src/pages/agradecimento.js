import { FaWhatsapp } from "react-icons/fa";
import Image from 'next/image';
// Certifique-se de importar o seu CSS aqui se ele não for global
// import './Agradecimento.css'; 

const WHATSAPP_NUMBER_E164 = "5511963249706";
const TRIGGER_MESSAGE = "Quero ser parceiro da Darius";

export default function AgradecimentoPage() {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(TRIGGER_MESSAGE)}`;

  return (
    <main className="agradecimento-container">
        
      <div className="logo-wrapper">
        <Image 
          src="/images/bruttusbg.png" 
          alt="Bruttus Logo"
          width={200}
          height={200}
          priority
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div className="text-content">
        <h2>Falta pouco!</h2>
        <p>
          Entre em contato com a nossa equipe para obter seu link de compra e tirar suas dúvidas sobre a Bruttus!
        </p>
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp"
      >
        <FaWhatsapp size={28} />
        Finalizar cadastro
      </a>

      <p className="footer-text">
        Você será redirecionado para o WhatsApp
      </p>

    </main>
  );
}