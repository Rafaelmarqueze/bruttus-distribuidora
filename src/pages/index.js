"use client";
import Header from '../components/Header/Header'
import Hero from '../components/Hero/Hero'
import Products from '../components/Products/Products'
import Commitment from '../components/Commitment/Commitment'
import DigitalMenu from '../components/DigitalMenu/DigitalMenu'
import FAQ from '../components/FAQ/FAQ'
import Contact from '../components/Contact/Contact'
import Footer from '../components/Footer/Footer'
import HB from '../components/HB/HB'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HB />
        <Products />
        <Commitment />
        <DigitalMenu />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}