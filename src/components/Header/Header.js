"use client";
import { useState } from 'react'
import { HeaderContainer, Nav, Logo, NavLinks, MobileMenuButton } from './styles'
import Image from 'next/image'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <HeaderContainer>
      <div className="container">
        <Nav>
          <Logo>
            <Image 
            src="/images/logo.jpg"
            alt="Logo Bruttus"
            width={150}
            height={70}
            />
          </Logo>
          
          <MobileMenuButton onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </MobileMenuButton>

          <NavLinks $isOpen={isOpen}>
            <li><a href="#sobre">SOBRE</a></li>
            <li><a href="#produtos">PRODUTOS</a></li>
            <li><a href="#qualidade">QUALIDADE</a></li>
            <li><a href="#cardapio">CARDÁPIO</a></li>
            <li><a href="#contato">CONTATO</a></li>
          </NavLinks>
        </Nav>
      </div>
    </HeaderContainer>
  )
}