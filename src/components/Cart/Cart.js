"use client";
import { useState } from "react";
import styled from "styled-components";
import MercadoPagoBricks from "@/components/MercadoPagoBricks/MercadoPagoBricks";

const CartContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
  max-height: 85vh;
  overflow-y: auto;
`;

const CartTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 22px;
  border-bottom: 2px solid #ff6b35;
  padding-bottom: 10px;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
`;

const CartItem = styled.div`
  background: #f9f9f9;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 4px;
  border-left: 3px solid #ff6b35;
`;

const ItemName = styled.p`
  margin: 0 0 5px 0;
  color: #333;
  font-weight: bold;
  font-size: 14px;
`;

const ItemDetails = styled.p`
  margin: 0 0 8px 0;
  color: #666;
  font-size: 12px;
`;

const ItemPrice = styled.p`
  margin: 0 0 10px 0;
  color: #ff6b35;
  font-weight: bold;
  font-size: 14px;
`;

const RemoveButton = styled.button`
  padding: 4px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #c82333;
  }
`;

const Divider = styled.hr`
  margin: 15px 0;
  border: none;
  border-top: 1px solid #ddd;
`;

const TotalSection = styled.div`
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #333;
  font-weight: ${(props) => (props.$main ? "bold" : "normal")};
  font-size: ${(props) => (props.$main ? "18px" : "14px")};
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;

  &:hover {
    background: #218838;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ContinueButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;

  &:hover {
    background: #e0e0e0;
  }
`;

const SuccessModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #28a745;
  font-size: 28px;
`;

const ModalText = styled.p`
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
`;

const ModalCode = styled.div`
  background: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  margin: 20px 0;
  border: 2px dashed #28a745;
`;

const CodeLabel = styled.p`
  color: #666;
  margin: 0 0 10px 0;
  font-weight: bold;
`;

const Code = styled.p`
  margin: 0;
  color: #333;
  font-size: 20px;
  font-family: monospace;
  word-break: break-all;
`;

const CouponInfo = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
`;

const CopyButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #0056b3;
  }
`;

export default function Cart({ cart, setCart, cnpj }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [showBricks, setShowBricks] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [paymentError, setPaymentError] = useState("");

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemoveItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    setLoading(true);

    try {
      // Call MercadoPago checkout endpoint to create preference
      const response = await fetch("/api/checkout-mercadopago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cnpj,
          items: cart,
          total,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Checkout API Response:", data);
        
        if (!data.preferenceId) {
          console.error("No preferenceId in response:", data);
          alert("Erro: Preferência de pagamento não recebida");
          return;
        }
        
        setPreferenceId(data.preferenceId);
        setShowBricks(true);
      } else {
        let errorText = "Erro ao processar a compra";
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorData.details || errorText;
          console.error("Checkout error response:", errorData);
        } catch (e) {
          const bodyText = await response.text();
          console.error("Checkout error (non-JSON):", bodyText.substring(0, 500));
          errorText = `Erro do servidor: ${response.status}`;
        }
        alert(errorText);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar a compra. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBricksSuccess = (data) => {
    setCoupon(data.coupon);
    setSuccess(true);
    setShowBricks(false);
    setCart([]);
  };

  const handleBricksError = (error) => {
    setPaymentError(typeof error === 'string' ? error : JSON.stringify(error));
    setShowBricks(false);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(coupon);
    alert("Cupom copiado para o clipboard!");
  };

  if (success) {
    return (
      <SuccessModal onClick={() => setSuccess(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>✓ Compra Concluída com Sucesso!</ModalTitle>

          <ModalText>
            Sua compra foi processada com sucesso. Aqui está seu cupom de 30
            dias grátis:
          </ModalText>

          <ModalCode>
            <CodeLabel>Cupom de 30 Dias Grátis:</CodeLabel>
            <Code>{coupon}</Code>
          </ModalCode>

          <CouponInfo>
            <strong>Salve este código para ativar seus 30 dias grátis!</strong>
            <br />
            Você pode usar este cupom após realizar sua primeira compra ou
            inscrição.
          </CouponInfo>

          <ModalText style={{ fontSize: "14px", color: "#666" }}>
            Obrigado por comprar com a Bruttus Distribuidora!
          </ModalText>

          <CopyButton onClick={handleCopyCoupon}>Copiar Cupom</CopyButton>
        </ModalContent>
      </SuccessModal>
    );
  }

  if (paymentError) {
    return (
      <SuccessModal onClick={() => setPaymentError("")}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle style={{ color: '#c82333' }}>✗ Pagamento Não Autorizado</ModalTitle>
          <ModalText>{paymentError}</ModalText>
          <CopyButton onClick={() => setPaymentError("")}>Fechar</CopyButton>
        </ModalContent>
      </SuccessModal>
    );
  }

  return (
    <>
      <CartContainer>
        <CartTitle>
          🛒 Carrinho {itemCount > 0 && `(${itemCount})`}
        </CartTitle>

        {cart.length === 0 ? (
          <EmptyCart>Seu carrinho está vazio</EmptyCart>
        ) : (
          <>
            {cart.map((item) => (
              <CartItem key={item.id}>
                <ItemName>{item.name}</ItemName>
                <ItemDetails>Quantidade: {item.quantity}</ItemDetails>
                <ItemDetails>Preço unitário: R$ {item.price.toFixed(2)}</ItemDetails>
                <ItemPrice>Subtotal: R$ {item.subtotal.toFixed(2)}</ItemPrice>
                <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                  Remover
                </RemoveButton>
              </CartItem>
            ))}

            <Divider />

            <TotalSection>
              <TotalRow>
                <span>Itens:</span>
                <span>{itemCount}</span>
              </TotalRow>
              <TotalRow>
                <span>Subtotal:</span>
                <span>R$ {total.toFixed(2)}</span>
              </TotalRow>
              <TotalRow $main>
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </TotalRow>
            </TotalSection>

            <CheckoutButton
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
            >
              {loading ? "Processando..." : "Finalizar Compra"}
            </CheckoutButton>

            <ContinueButton>Continuar Comprando</ContinueButton>
          </>
        )}
      </CartContainer>

      {showBricks && preferenceId && (
        <MercadoPagoBricks
          preferenceId={preferenceId}
          total={total}
          cnpj={cnpj}
          cart={cart}
          onClose={() => setShowBricks(false)}
          onSuccess={handleBricksSuccess}
          onError={handleBricksError}
        />
      )}
    </>
  );
}
