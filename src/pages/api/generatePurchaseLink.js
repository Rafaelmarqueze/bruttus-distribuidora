export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { cnpj } = req.body;

  if (!cnpj || cnpj.trim() === "") {
    return res.status(400).json({ error: "CNPJ é obrigatório" });
  }

  try {
    // Remove qualquer pontuação do CNPJ
    const cleanCNPJ = cnpj.trim().replace(/[^\d]/g, "");

    if (cleanCNPJ.length !== 14) {
      return res.status(400).json({ error: "CNPJ deve conter 14 dígitos" });
    }

    // Generate purchase link with clean CNPJ (sem pontuação)
    const purchaseLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/purchase?cnpj=${cleanCNPJ}`;

    return res.status(200).json({
      success: true,
      purchaseLink,
      cnpj: cleanCNPJ,
    });
  } catch (error) {
    console.error("Erro ao gerar link de compra:", error);
    return res.status(500).json({ error: "Erro ao gerar link de compra" });
  }
}
