"use client";
import { useState } from 'react'
import Header from '../components/Header/Header'
import Hero from '../components/Hero/Hero'
import Commitment from '../components/Commitment/Commitment'
import DigitalMenu from '../components/DigitalMenu/DigitalMenu'
import FAQ from '../components/FAQ/FAQ'
import Contact from '../components/Contact/Contact'
import Footer from '../components/Footer/Footer'
import HB from '../components/HB/HB'
import FloatingWhatsApp from '../components/FloatingWhatsApp/FloatingWhatsApp'
import HomeProducts from '@/components/HomeProducts/HomeProducts';

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const handleWhatsAppClick = () => {
    setIsContactModalOpen(true)
  }

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false)
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <HB />
        <HomeProducts />
        <Commitment />
        <DigitalMenu />
        <FAQ />
        <Contact openModal={isContactModalOpen} onCloseModal={handleCloseContactModal} />
      </main>
      <Footer />
      <FloatingWhatsApp onClick={handleWhatsAppClick} />
    </>
  )
}