import { useEffect, useState } from "react";
import styled from "styled-components";

const BricksContainer = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const BricksContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  h2 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 24px;
  }

  #bricksAmount {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  z-index: 10;

  &:hover {
    color: #333;
  }
`;

const MethodButton = styled.button`
  padding: 10px 16px;
  background: ${props => props.active ? "#ff6b35" : "#eee"};
  color: ${props => props.active ? "white" : "#333"};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  flex: 1;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const PixInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #ff6b35;
  }
`;

export default function MercadoPagoBricks({
    preferenceId,
    total,
    cnpj,
    cart,
    onClose,
    onSuccess,
    onError,
}) {
    // payer data will be obtained directly from the Bricks form submission
    const [bricksInstance, setBricksInstance] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [method, setMethod] = useState("card"); // Inicia no cartão por padrão
    const [pixData, setPixData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cardInitError, setCardInitError] = useState(null);
    const [paymentInitError, setPaymentInitError] = useState(null);
    const [paymentInitializing, setPaymentInitializing] = useState(false);
    const [paymentInitialized, setPaymentInitialized] = useState(false);
    const [pixRequested, setPixRequested] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const init = async () => {
            let attempts = 0;
            const maxAttempts = 20;

            while (!window.MercadoPago && attempts < maxAttempts) {
                await new Promise((r) => setTimeout(r, 100));
                attempts++;
            }

            if (!window.MercadoPago) {
                console.error("MercadoPago script não carregou");
                return;
            }

            const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
            if (!publicKey) return;

            try {
                const mp = new window.MercadoPago(publicKey);
                const bricksBuilder = mp.bricks();
                setBricksInstance(bricksBuilder);
                setInitialized(true);
            } catch (err) {
                console.error("Erro inicializando MercadoPago:", err);
            }
        };

        init();

        return () => {
            const paymentElement = document.getElementById("payment");
            if (paymentElement) paymentElement.innerHTML = "";
            const cardContainer = document.getElementById("cardPaymentContainer");
            if (cardContainer) cardContainer.innerHTML = "";
        };
    }, []);

    const createPreferencePaymentBrick = async () => {
        if (!bricksInstance || !preferenceId) return;

        try {
            setPaymentInitializing(true);
            const paymentEl = document.getElementById("payment");
            if (paymentEl) paymentEl.innerHTML = "";

            await bricksInstance.create("payment", "payment", {
                initialization: {
                    preferenceId: preferenceId,
                    amount: Number(total),
                },
                callbacks: {
                    onReady: () => {
                        setPaymentInitialized(true);
                        setPaymentInitializing(false);
                    },
                    onError: (err) => {
                        console.error("Erro no Payment Brick:", err);
                        setPaymentInitError(err?.message || "Erro no checkout");
                    },
                },
            });
        } catch (err) {
            setPaymentInitializing(false);
        }
    };

    const handleCopyPix = () => {
        if (pixData?.qr_code) {
            navigator.clipboard.writeText(pixData.qr_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const generatePix = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payerEmail)) {
            onError("Por favor, informe um e-mail válido.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/checkout-pix", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cnpj,
                    items: cart || [],
                    total,
                    email: payerEmail, // Enviando o email capturado no input
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                onError(data.error || "Erro ao criar Pix");
                return;
            }

            setPixData(data);
            setPixRequested(true);
        } catch (err) {
            onError("Erro ao gerar Pix");
        } finally {
            setLoading(false);
        }
    };

    return (
        <BricksContainer onClick={onClose}>
            <BricksContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>×</CloseButton>
                <h2>Finalizar Pedido</h2>
                <div id="bricksAmount">Total a pagar: <strong>R$ {Number(total || 0).toFixed(2)}</strong></div>

                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    <MethodButton active={method === "card"} onClick={() => setMethod("card")}>Cartão</MethodButton>
                    <MethodButton active={method === "pix"} onClick={() => setMethod("pix")}>Pix</MethodButton>
                </div>

                {method === "card" && (
                    <div>
                        {/* card brick itself already includes fields for payer info */}
                        <div id="payment" />
                        <div id="cardPaymentContainer" />
                        {!initialized && <div style={{ color: "#999" }}>Carregando Mercado Pago...</div>}

                        {initialized && (
                            <CardBrickInitializer
                                bricksBuilder={bricksInstance}
                                total={total}
                                cnpj={cnpj}
                                cart={cart}
                                onSuccess={onSuccess}
                                onError={onError}
                                onInitError={(msg) => setCardInitError(msg)}
                                onFallback={createPreferencePaymentBrick}
                            />
                        )}
                        {cardInitError && <div style={{ color: "red", marginTop: 10 }}>{cardInitError}</div>}
                    </div>
                )}

                {method === "pix" && (
                    <div id="pixContainer">
                        {!pixData ? (
                            <div>
                                <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>E-mail para receber o comprovante:</label>
                                <PixInput
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={payerEmail}
                                    onChange={(e) => setPayerEmail(e.target.value)}
                                />
                                <button
                                    onClick={generatePix}
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        background: "#ff6b35",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontWeight: "bold",
                                        cursor: loading ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {loading ? "Gerando..." : "Gerar QR Code Pix"}
                                </button>
                            </div>
                        ) : (
                            <div style={{ textAlign: "center" }}>
                                <div style={{ marginBottom: 15, fontWeight: "bold" }}>Escaneie o QR Code:</div>
                                {pixData.qr_code_base64 && (
                                    <img
                                        alt="QR Code Pix"
                                        src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                        style={{ maxWidth: "200px", display: "block", margin: "0 auto 15px" }}
                                    />
                                )}
                                <div style={{ marginBottom: 10 }}>
                                    <label style={{ fontSize: "12px", color: "#666" }}>Código Pix (Copia e Cola):</label>
                                    <input
                                        readOnly
                                        value={pixData.qr_code}
                                        style={{ width: "100%", padding: "8px", marginTop: "5px", fontSize: "12px" }}
                                        onClick={(e) => e.target.select()}
                                    />
                                </div>
                                <button
                                    onClick={handleCopyPix}
                                    style={{
                                        background: copied ? "#4caf50" : "#0070f3",
                                        color: "white",
                                        border: "none",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        width: "100%",
                                        cursor: "pointer"
                                    }}
                                >
                                    {copied ? "✓ Copiado!" : "Copiar Código Pix"}
                                </button>
                                <p style={{ fontSize: '12px', color: '#666', marginTop: '15px' }}>
                                    Após o pagamento, o sistema processará seu pedido automaticamente.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </BricksContent>
        </BricksContainer>
    );
}

function CardBrickInitializer({ bricksBuilder, total, cnpj, cart, onSuccess, onError, onInitError, onFallback }) {
    useEffect(() => {
        if (!bricksBuilder) return;

        let controller;

        const delay = (ms) => new Promise((r) => setTimeout(r, ms));

        const initCard = async () => {
            const maxAttempts = 3;
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    // Attempt to unmount any previously-initialized card controller
                    try {
                        if (window.cardPaymentBrickController && typeof window.cardPaymentBrickController.unmount === "function") {
                            try {
                                window.cardPaymentBrickController.unmount();
                            } catch (e) {
                                // ignore
                            }
                            window.cardPaymentBrickController = null;
                        }
                    } catch (e) {
                        // ignore
                    }

                    // clear container safely before trying
                    const cont = document.getElementById("cardPaymentContainer");
                    try {
                        if (cont) cont.innerHTML = "";
                    } catch (e) {
                        // ignore DOM removal issues
                    }

                    const settings = {
                        initialization: {
                            amount: Number(total || 0),
                        },
                        callbacks: {
                            onReady: () => {
                                console.log("Card Brick ready");
                            },
                            onSubmit: async (formData, additionalData) => {
                                console.log("Card submit:", formData, additionalData);
                                try {
                                    // First: create payment server-side with MercadoPago using tokenized card data
                                    // derive payer details from submitted fields
                                    const payerDetails = {};
                                    if (formData?.payer) {
                                        if (formData.payer.email) payerDetails.email = formData.payer.email;
                                        if (formData.payer.first_name) payerDetails.name = formData.payer.first_name;
                                    }
                                    // cardholder section also sometimes contains name/email
                                    if (formData?.cardholder) {
                                        if (formData.cardholder.email) payerDetails.email = payerDetails.email || formData.cardholder.email;
                                        if (formData.cardholder.name) payerDetails.name = payerDetails.name || formData.cardholder.name;
                                    }
                                    const payResp = await fetch("/api/checkout-card-payment", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ cnpj, items: cart || [], total, formData, additionalData, payer: payerDetails }),
                                    });

                                    const payData = await payResp.json();
                                    if (!payResp.ok) {
                                        console.error('Card payment creation failed:', payData);
                                        onError(payData.error || 'Erro ao processar pagamento');
                                        return;
                                    }

                                    // If payment was explicitly rejected, do NOT create purchase or show success.
                                    // Notify user that card was not authorized.
                                    const status = (payData.status || '').toLowerCase();
                                    if (status === 'rejected' || status === 'refused') {
                                        console.warn('Card payment was rejected:', payData);
                                        try {
                                            onError('Cartão não autorizado. Por favor, utilize outro cartão ou tente novamente.');
                                        } catch (e) {
                                            // ignore
                                        }
                                        return;
                                    }

                                    // For approved payments, register purchase and generate coupon immediately.
                                    // For other statuses (e.g., in_process), register purchase as pending.
                                    const checkoutResp = await fetch('/api/checkout', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ cnpj, items: cart || [], total, payment: { id: payData.id, status: payData.status } }),
                                    });

                                    const checkoutData = await checkoutResp.json();
                                    if (checkoutResp.ok) {
                                        // If payment not approved yet, inform user accordingly via onSuccess payload
                                        onSuccess(checkoutData);
                                    } else {
                                        console.error('Checkout registration failed:', checkoutData);
                                        onError(checkoutData.error || 'Erro ao registrar compra');
                                    }
                                } catch (err) {
                                    console.error("Erro ao submeter pagamento do cartão:", err);
                                    onError(err.message || "Erro no pagamento por cartão");
                                }
                            },
                            onError: (err) => {
                                console.error("Card Brick error:", err);
                                onError("Erro no Card Brick");
                            },
                        },
                    };

                    controller = await bricksBuilder.create("cardPayment", "cardPaymentContainer", settings);
                    window.cardPaymentBrickController = controller;
                    console.log("CardPayment controller set", controller);
                    return; // sucesso
                } catch (err) {
                    console.error(`Card Brick init attempt ${attempt} failed:`, err);
                    // se última tentativa, propagar mensagem via onError
                    if (attempt === maxAttempts) {
                        const message = err?.message || (err?.type ? JSON.stringify(err) : "Erro no Card Brick");
                        try {
                            onError(message);
                        } catch (e) {
                            // ignore
                        }
                        try {
                            if (typeof onInitError === "function") onInitError(message);
                        } catch (e) {
                            // ignore
                        }

                        // Se o erro for relacionado a Secure Fields, disparar fallback automático
                        try {
                            const cause = err?.cause || (err?.type === "critical" ? "critical" : undefined);
                            if (cause === "fields_setup_failed_after_3_tries" && typeof onFallback === "function") {
                                console.warn("Card Brick failed with secure fields error — acionando fallback automático");
                                onFallback();
                            }
                            // If the error indicates the brick was already initialized, try to fallback as well
                            if (cause === "already_initialized" && typeof onFallback === "function") {
                                console.warn("Card Brick reported already_initialized — attempting fallback");
                                onFallback();
                            }
                        } catch (e) {
                            // ignore
                        }
                    } else {
                        // aguardar um pouco antes da próxima tentativa
                        await delay(500 * attempt);
                    }
                }
            }
        };

        initCard();

        return () => {
            try {
                if (window.cardPaymentBrickController && typeof window.cardPaymentBrickController.unmount === "function") {
                    window.cardPaymentBrickController.unmount();
                }
            } catch (e) {
                // ignore
            }
        };
    }, [bricksBuilder, total, cnpj, cart, onSuccess, onError]);

    return null;
}
