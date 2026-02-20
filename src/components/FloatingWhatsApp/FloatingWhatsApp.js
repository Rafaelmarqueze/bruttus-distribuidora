"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { FloatingButton } from './styles';

export default function FloatingWhatsApp({ onClick }) {
  const [jump, setJump] = useState(true);

  // Exemplo: parar de pular após 5 segundos para não irritar o usuário
  useEffect(() => {
    const timer = setTimeout(() => setJump(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <FloatingButton 
      onClick={onClick} 
      $jump={jump}
      aria-label="Fale com o WhatsApp"
      title="Abrir WhatsApp"
    >
      <Image 
        src="/images/Whatsapp.png" 
        alt="WhatsApp"
        width={40}
        height={40}
      />
    </FloatingButton>
  );
}