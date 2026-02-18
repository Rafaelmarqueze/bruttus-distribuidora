"use client";
import Image from "next/image"
import { FooterContainer, FooterContent, Copyright } from "./styles"

export default function Footer() {
  return (
    <FooterContainer>
      <div className="container">

        <FooterContent>

          <Image
            src="/images/logo.jpg"
            alt="Logo Bruttus"
            width={120}
            height={55}
          />
        </FooterContent>

        <Copyright>
          © 2026 Bruttus Distribuidora. Todos os direitos reservados.
        </Copyright>

      </div>
    </FooterContainer>
  )
}
