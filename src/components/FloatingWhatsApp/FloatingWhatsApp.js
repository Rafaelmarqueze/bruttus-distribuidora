"use client";

import Image from 'next/image';
import { FloatingButton } from './styles'

export default function FloatingWhatsApp({ onClick }) {
  return (
    <FloatingButton onClick={onClick} title="Abrir WhatsApp">
      <Image 
        src="/images/whatsapp.png" 
        alt="WhatsApp"
        width={64}
        height={64}
      />
    </FloatingButton>
  )
}
