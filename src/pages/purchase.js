"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Header from "../components/Header/Header";
import PurchaseHero from "../components/PurchaseHero/PurchaseHero";
import Footer from "../components/Footer/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp/FloatingWhatsApp";
import Cart from "../components/Cart/Cart";

const PurchaseContainer = styled.main`
  min-height: 100vh;
`;

const ProductsSection = styled.section`
  background: #f5f5f5;
  padding: 60px 20px;
`;

const ProductsSectionInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin: 0 0 50px 0;
  color: #333;
  
  span {
    color: #ff6b35;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const ProductsWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a55 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: white;
  font-size: 3rem;
  font-weight: bold;
`;

const ProductName = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
  font-weight: bold;
`;

const ProductDescription = styled.p`
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const PriceTag = styled.div`
  background: #ff6b35;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const QuantityLabel = styled.label`
  color: #333;
  font-weight: bold;
  font-size: 14px;
  flex: 1;
`;

const QuantityInput = styled.input`
  width: 70px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #ff6b35;
  }
`;

const AddButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: background 0.3s ease;

  &:hover {
    background: #e55a1f;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
`;

const PendingMessage = styled.div`
  background: #fff3cd;
  color: #856404;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #ffeaa7;
`;

const NoAccessMessage = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  max-width: 500px;
  margin: 60px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  h2 {
    color: #333;
    margin: 0 0 15px 0;
  }

  p {
    color: #666;
    margin: 0;
  }
`;

export default function Purchase() {
  const router = useRouter();
  const { cnpj, status } = router.query;
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState({});
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const BURGER_SIZES = [
    {
      label: "100g",
      description: "90 unidades por caixa",
      value: "100g",
      price: 150.0,
      emoji: "🥩",
    },
    {
      label: "120g",
      description: "90 unidades por caixa",
      value: "120g",
      price: 170.0,
      emoji: "🥩",
    },
    {
      label: "150g",
      description: "90 unidades por caixa",
      value: "150g",
      price: 200.0,
      emoji: "🥩",
    },
    {
      label: "180g",
      description: "90 unidades por caixa",
      value: "180g",
      price: 230.0,
      emoji: "🥩",
    },
    {
      label: "200g",
      description: "90 unidades por caixa",
      value: "200g",
      price: 250.0,
      emoji: "🥩",
    },
    {
      label: "Saco 3Kg",
      description: "Embalagem econômica",
      value: "3kg",
      price: 120.0,
      emoji: "💼",
    },
  ];

  const handleAddToCart = (size) => {
    const qty = parseInt(quantity[size.value] || 1);

    if (qty < 1) {
      setError("Quantidade deve ser maior que 0");
      return;
    }

    const item = {
      id: `${size.value}-${Date.now()}`,
      name: `Burger - ${size.label}`,
      size: size.value,
      quantity: qty,
      price: size.price,
      subtotal: size.price * qty,
    };

    setCart([...cart, item]);
    setError("");
    setQuantity({ ...quantity, [size.value]: "" });
  };

  const handleWhatsAppClick = () => {
    setIsContactModalOpen(true);
  };

  if (!cnpj) {
    return (
      <>
        <Header />
        <PurchaseContainer>
          <PurchaseHero />
          <ProductsSection>
            <ProductsSectionInner>
              <NoAccessMessage>
                <h2>⚠️ Acesso Não Autorizado</h2>
                <p>Link de compra inválido ou expirado. Solicite um novo link ao admin.</p>
              </NoAccessMessage>
            </ProductsSectionInner>
          </ProductsSection>
        </PurchaseContainer>
        <Footer />
        <FloatingWhatsApp onClick={handleWhatsAppClick} />
      </>
    );
  }

  return (
    <>
      <Header />
      <PurchaseContainer>
        <PurchaseHero />
        <ProductsSection>
          <ProductsSectionInner>
            <SectionTitle>
              Selecione Nossos <span>Produtos</span>
            </SectionTitle>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {status === 'success' && (
              <SuccessMessage>
                ✓ Pagamento realizado com sucesso! Você receberá um e-mail com os detalhes da sua compra e cupom de 30 dias grátis.
              </SuccessMessage>
            )}

            {status === 'failure' && (
              <ErrorMessage>
                ✗ Pagamento recusado. Por favor, verifique seus dados e tente novamente. Se o problema persistir, entre em contato conosco.
              </ErrorMessage>
            )}

            {status === 'pending' && (
              <PendingMessage>
                ⏳ Seu pagamento está sendo processado. Você receberá uma confirmação em breve.
              </PendingMessage>
            )}

            <ProductsWrapper>
              <ProductGrid>
                {BURGER_SIZES.map((size) => (
                  <ProductCard key={size.value}>
                    <ProductImage>{size.emoji}</ProductImage>
                    <ProductName>{size.label}</ProductName>
                    <ProductDescription>{size.description}</ProductDescription>
                    <PriceTag>R$ {size.price.toFixed(2)}</PriceTag>

                    <QuantityContainer>
                      <QuantityLabel>Qtd:</QuantityLabel>
                      <QuantityInput
                        type="number"
                        min="1"
                        value={quantity[size.value] || ""}
                        onChange={(e) =>
                          setQuantity({
                            ...quantity,
                            [size.value]: e.target.value,
                          })
                        }
                        placeholder="1"
                      />
                    </QuantityContainer>

                    <AddButton onClick={() => handleAddToCart(size)}>
                      Adicionar ao Carrinho
                    </AddButton>
                  </ProductCard>
                ))}
              </ProductGrid>

              <Cart cart={cart} setCart={setCart} cnpj={cnpj} />
            </ProductsWrapper>
          </ProductsSectionInner>
        </ProductsSection>
      </PurchaseContainer>
      <Footer />
      <FloatingWhatsApp onClick={handleWhatsAppClick} />
    </>
  );
}
