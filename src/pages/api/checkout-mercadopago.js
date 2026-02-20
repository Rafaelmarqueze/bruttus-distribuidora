export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { cnpj, items, total } = req.body;

  console.log("=== CHECKOUT MERCADOPAGO REQUEST ===");
  console.log("Body received:", { cnpj, itemsCount: items?.length, total });

  if (!cnpj || !items || items.length === 0 || total === undefined) {
    console.error("Invalid request data:", { cnpj, items, total });
    return res.status(400).json({ error: "Dados inválidos para checkout" });
  }

  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("Missing MERCADOPAGO_ACCESS_TOKEN");
      return res.status(500).json({
        error: "MercadoPago não configurado",
        details: "MERCADOPAGO_ACCESS_TOKEN não definido",
      });
    }

    console.log("Creating preference with items:", items);

    // Create preference object for MercadoPago
    const preferenceData = {
      items: items.map((item) => ({
        title: item.name,
        description: `${item.weight}`,
        unit_price: parseFloat(item.price),
        quantity: item.quantity,
        currency_id: "BRL",
      })),
      payer: {
        email: "customer@example.com",
      },
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercado-pago/payment`,
      external_reference: cnpj,
    };

    console.log("Preference data prepared:", JSON.stringify(preferenceData, null, 2));

    // Create preference via MercadoPago API using fetch
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceData),
    });

    const responseText = await response.text();
    console.log("MercadoPago raw response:", {
      status: response.status,
      statusOk: response.ok,
      headers: Object.fromEntries(response.headers),
      body: responseText.substring(0, 500),
    });

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse MercadoPago response as JSON:", parseError);
      return res.status(response.status || 500).json({
        error: "Resposta inválida do MercadoPago",
        details: `Não foi possível processar a resposta: ${responseText.substring(0, 200)}`,
      });
    }

    console.log("MercadoPago API Response:", {
      status: response.status,
      statusOk: response.ok,
      preferenceId: responseData.id,
      responseData,
    });

    if (!response.ok) {
      console.error("MercadoPago API Error:", responseData);
      return res.status(response.status).json({
        error: "Erro ao criar preferência no MercadoPago",
        details: responseData.message || responseData.error || JSON.stringify(responseData),
      });
    }

    if (!responseData.id) {
      console.error("Missing preference ID in response:", responseData);
      return res.status(500).json({
        error: "Resposta inválida do MercadoPago",
        details: "ID de preferência não recebido",
      });
    }

    console.log("=== SUCCESS ===");
    console.log("Preference created:", responseData.id);

    return res.status(200).json({
      success: true,
      preferenceId: responseData.id,
    });
  } catch (error) {
    console.error("=== ERROR ===");
    console.error("Erro ao criar preferência MercadoPago:", error);
    console.error("Error stack:", error.stack);
    
    return res.status(500).json({
      error: "Erro ao inicializar pagamento",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
