export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { cnpj, items, total } = req.body;
  if (!cnpj || !items || items.length === 0 || total === undefined) {
    return res.status(400).json({ error: "Dados inválidos para checkout Pix" });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ error: "MERCADOPAGO_ACCESS_TOKEN não configurado" });
  }

  try {
    // Usar Payments API para criar pagamento Pix (retorna point_of_interaction com QR)
    // Payments API for PIX expects a payer object with at least an email in many cases.
    // Provide a sensible default when caller didn't include payer.
    const defaultPayer = { email: `no-reply@bruttusburg.com.br` };

    const body = {
      transaction_amount: Number(total),
      payment_method_id: "pix",
      description: `Compra Blend de carne - ${cnpj}`,
      external_reference: cnpj,
      payer: req.body.payer || defaultPayer,
    };

    // Add an idempotency key header — MercadoPago expects this for Payments
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const resp = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-idempotency-key": idempotencyKey,
      },
      body: JSON.stringify(body),
    });

    const rawText = await resp.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("checkout-pix: resposta não-JSON do MercadoPago:", rawText);
      return res.status(500).json({ error: "Resposta inválida do MercadoPago", details: rawText });
    }

    console.log("checkout-pix: MercadoPago response status:", resp.status);
    console.log("checkout-pix: MercadoPago response body:", JSON.stringify(data));

    if (!resp.ok) {
      console.error("checkout-pix: MercadoPago API error:", data);
      return res.status(resp.status).json({ error: "Erro ao criar pagamento Pix", details: data });
    }

    // Extrair dados de point_of_interaction (vários formatos possíveis conforme a API)
    const poi = data.point_of_interaction || {};
    const transactionData = poi.transaction_data || {};

    const qr_code = poi.qr_code || transactionData.qr_code || null;
    const qr_code_base64 = poi.qr_code_base64 || transactionData.qr_code_base64 || null;
    const ticket_url = transactionData.ticket_url || poi.ticket_url || null;

    // If no QR fields, include raw response to help debugging on client
    if (!qr_code && !qr_code_base64) {
      console.warn("checkout-pix: no qr_code found in MercadoPago response", { id: data.id });
      return res.status(200).json({ id: data.id, qr_code: null, qr_code_base64: null, ticket_url, raw: data, warning: 'no_qr_found' });
    }

    return res.status(200).json({ id: data.id, qr_code, qr_code_base64, ticket_url, raw: data });
  } catch (error) {
    console.error("Erro no checkout-pix:", error);
    return res.status(500).json({ error: "Erro ao criar pagamento Pix", details: error.message });
  }
}
