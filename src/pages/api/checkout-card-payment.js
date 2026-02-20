export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { cnpj, items, total, formData, additionalData, payer } = req.body;
  if (!cnpj || !items || items.length === 0 || total === undefined) {
    return res.status(400).json({ error: 'Dados inválidos para pagamento com cartão' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) return res.status(500).json({ error: 'MERCADOPAGO_ACCESS_TOKEN não configurado' });

  try {
    // Build payment payload accommodating the tokenized card data from Bricks
    const payload = {
      transaction_amount: Number(total),
      description: `Compra - ${cnpj}`,
      payer: { email: 'customer@example.com' },
      installments: Number(additionalData?.installments || 1),
    };

    // override payer details if provided
    if (payer && typeof payer === 'object') {
      payload.payer = payload.payer || {};
      if (payer.email) payload.payer.email = payer.email;
      if (payer.name) {
        // MercadoPago expects first_name/last_name; we'll put full name in first_name
        payload.payer.first_name = payer.name;
      }
    }

    // Prefer token field if provided by Bricks
    if (formData?.token || formData?.cardToken) {
      payload.token = formData.token || formData.cardToken;
    }

    // payment method id (visa, mastercard, etc.)
    if (additionalData?.payment_method_id || formData?.payment_method_id) {
      payload.payment_method_id = additionalData?.payment_method_id || formData?.payment_method_id;
    }

    // Add payer identification if present
    if (formData?.cardholder?.identification) {
      payload.payer = payload.payer || {};
      payload.payer.identification = formData.cardholder.identification;
    }

    const idempotencyKey = `idemp_card_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;

    const resp = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-idempotency-key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { data = null; }

    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'Erro ao criar pagamento', details: data || text });
    }

    // Return payment object (id, status, raw)
    return res.status(200).json({ id: data.id, status: data.status, raw: data });
  } catch (err) {
    console.error('Erro em checkout-card-payment:', err);
    return res.status(500).json({ error: 'Erro ao processar pagamento', details: err.message });
  }
}
