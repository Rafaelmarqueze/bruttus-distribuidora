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

export default function MercadoPagoBricks({
    preferenceId,
    total,
    cnpj,
    cart,
    onClose,
    onSuccess,
    onError,
}) {
    const [payerName, setPayerName] = useState("");
    const [payerCPF, setPayerCPF] = useState("");
    const [payerEmail, setPayerEmail] = useState("");
    const [bricksInstance, setBricksInstance] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [method, setMethod] = useState("card"); // 'card' | 'pix'
    const [pixData, setPixData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cardInitKey, setCardInitKey] = useState(0);
    const [cardInitError, setCardInitError] = useState(null);
    const [paymentInitError, setPaymentInitError] = useState(null);
    const [paymentInitializing, setPaymentInitializing] = useState(false);
    const [paymentInitialized, setPaymentInitialized] = useState(false);
    // prevent duplicate pix calls
    const [pixRequested, setPixRequested] = useState(false);

    useEffect(() => {
        // Inicializa o SDK do MercadoPago e armazena o bricksBuilder
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
            if (!publicKey) {
                console.error("Chave pública do MercadoPago não configurada");
                return;
            }

            try {
                const mp = new window.MercadoPago(publicKey);
                const bricksBuilder = mp.bricks();
                setBricksInstance(bricksBuilder);
                setInitialized(true);
                console.log("✅ MercadoPago inicializado (bricks ready)");
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

    // NOTE: do not auto-create the Payment Brick on load — create it only on explicit fallback.
    // This prevents the preference-based Payment Brick from stealing focus when the user
    // intends to use the Card Brick. Fallback will be triggered by CardBrickInitializer.

    const createPreferencePaymentBrick = async () => {
        if (!bricksInstance) return;
        if (!preferenceId) {
            setPaymentInitError("PreferenceId ausente");
            return;
        }

        try {
            setPaymentInitializing(true);
            // limpar container
            const paymentEl = document.getElementById("payment");
            if (paymentEl) paymentEl.innerHTML = "";

            // create expects a target element id (string) as second arg — provide "payment"
            await bricksInstance.create(
                "payment",
                "payment",
                {
                    initialization: {
                        preferenceId: preferenceId,
                        amount: (function () {
                            const n = Number(total || 0);
                            return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
                        })(),
                        currency: "BRL",
                    },
                    callbacks: {
                        onReady: () => {
                            console.log("Payment Brick pronto (fallback)");
                            setPaymentInitialized(true);
                            setPaymentInitError(null);
                            setPaymentInitializing(false);
                        },
                        onError: (err) => {
                            console.error("Erro no Payment Brick (fallback):", err);
                            // If the Payment Brick failed because no payment type was selected,
                            // open the MercadoPago redirect checkout as a last-resort fallback.
                            try {
                                const cause = err?.cause || err?.type;
                                const msg = err?.message || "";
                                if (cause === "payment_brick_initialization_failed" || /No payment type was selected/i.test(msg)) {
                                    const redirectUrl = `https://www.mercadopago.com/checkout/v1/redirect?pref_id=${preferenceId}`;
                                    console.warn("Payment Brick cannot initialize — opening redirect URL:", redirectUrl);
                                    try {
                                        window.open(redirectUrl, "_blank");
                                    } catch (e) {
                                        // ignore
                                    }
                                }
                            } catch (e) {
                                // ignore
                            }

                            setPaymentInitError(err?.message || JSON.stringify(err));
                            setPaymentInitializing(false);
                        },
                    },
                }
            );
        } catch (err) {
            console.error("Falha ao criar Payment Brick (fallback):", err);
            setPaymentInitError(err?.message || String(err));
            setPaymentInitializing(false);
        }
    };

    // Helper to generate Pix payment via backend and store result in state
    const generatePix = async () => {
        if (pixRequested) return;

        try {
            setPixRequested(true);
            setLoading(true);
            setPixData(null);

            if (!payerEmail || !payerEmail.includes("@")) {
                onError("Informe um email válido para pagamento via Pix");
                return;
            }

            const res = await fetch("/api/checkout-pix", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cnpj,
                    items: cart || [],
                    total,
                    payer: {
                        email: "customer@example.com",
                        name: "",
                        cpf: "12345678909",
                    },
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                console.error("Erro criando Pix:", data);
                onError(data.error || "Erro ao criar pagamento Pix");
                setLoading(false);
                return;
            }

            setPixData(data);
            setLoading(false);
        } catch (err) {
            console.error("Erro no checkout-pix:", err);
            onError(err.message || "Erro ao criar Pix");
            setLoading(false);
        }
    };

    return (
        <BricksContainer onClick={onClose}>
            <BricksContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>×</CloseButton>
                <h2>Formas de Pagamento</h2>
                <div id="bricksAmount">Total: R$ {Number(total || 0).toFixed(2)}</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <button
                        onClick={() => setMethod("card")}
                        style={{
                            padding: "8px 12px",
                            background: method === "card" ? "#0070f3" : "#eee",
                            color: method === "card" ? "white" : "#333",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                        }}
                    >
                        Cartão
                    </button>
                    <button
                        onClick={() => setMethod("pix")}
                        style={{
                            padding: "8px 12px",
                            background: method === "pix" ? "#0070f3" : "#eee",
                            color: method === "pix" ? "white" : "#333",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                        }}
                    >
                        Pix
                    </button>
                </div>

                {method === "card" && (
                    <div>
                        <div id="payment" />
                        <div id="cardPaymentContainer" />
                        {!initialized && (
                            <div style={{ color: "#999", marginTop: 10 }}>Aguardando SDK do MercadoPago...</div>
                        )}
                        {paymentInitializing && <div>Iniciando modal de pagamento...</div>}
                        {paymentInitError && <div style={{ color: "#b00020" }}>{paymentInitError}</div>}
                        {paymentInitialized && <div style={{ color: "#0a0" }}>Modal pronto</div>}

                        {/* Mount Card brick initializer to attempt secure fields card flow. */}
                        {initialized && (
                            <CardBrickInitializer
                                bricksBuilder={bricksInstance}
                                total={total}
                                cnpj={cnpj}
                                cart={cart}
                                payer={{ name: payerName, email: payerEmail, identification: { type: "CPF", number: payerCPF } }}
                                onSuccess={onSuccess}
                                onError={onError}
                                onInitError={(msg) => setCardInitError(msg)}
                                onFallback={createPreferencePaymentBrick}
                            />
                        )}
                        {cardInitError && <div style={{ color: "#b00020" }}>{cardInitError}</div>}
                    </div>
                )}

                {method === "pix" && (
                    <div id="pixContainer">
                        {loading && <div>Carregando opção Pix...</div>}

                        {!loading && pixData && (
                            <div style={{ textAlign: "center" }}>
                                <div style={{ marginBottom: 10, fontWeight: 600 }}>Instruções de pagamento (Pix)</div>
                                {pixData.qr_code_base64 ? (
                                    <img
                                        alt="QR Code Pix"
                                        src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                        style={{ maxWidth: "250px", marginBottom: 12 }}
                                    />
                                ) : null}

                                {pixData.qr_code && (
                                    <div style={{ marginBottom: 8 }}>
                                        <label>Chave / Código Pix (copiar):</label>
                                        <input
                                            readOnly
                                            value={pixData.qr_code}
                                            style={{ width: "100%", marginTop: 6 }}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                )}

                                {pixData.ticket_url && (
                                    <div style={{ marginTop: 8 }}>
                                        <a href={pixData.ticket_url} target="_blank" rel="noreferrer">
                                            Abrir instruções completas de pagamento
                                        </a>
                                    </div>
                                )}

                                <div style={{ marginTop: 12, color: "#444", fontSize: 14 }}>
                                    Copie o código ou escaneie o QR com o aplicativo do seu banco para finalizar o pagamento.
                                </div>
                            </div>
                        )}

                        {!loading && !pixData && (
                            <div>
                                <div style={{ marginBottom: 8 }}>Gerar pagamento via Pix</div>
                                <button
                                    onClick={generatePix}
                                    style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
                                >
                                    Gerar Pix
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </BricksContent>
        </BricksContainer>
    );
}

// Componente auxiliar para inicializar Card Payment Brick
function CardBrickInitializer({ bricksBuilder, total, cnpj, cart, payer, onSuccess, onError, onInitError, onFallback }) {
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
                                    const payResp = await fetch("/api/checkout-card-payment", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ cnpj, items: cart || [], total, formData, additionalData, payer }),
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
    }, [bricksBuilder, total, cnpj, cart, payer, onSuccess, onError]);

    return null;
}
