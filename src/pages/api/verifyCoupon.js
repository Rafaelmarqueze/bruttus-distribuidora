import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { coupon } = req.body;

  if (!coupon) {
    return res.status(400).json({ error: "Cupom é obrigatório" });
  }

  try {
    const decoded = jwt.verify(coupon, JWT_SECRET);

    return res.status(200).json({
      valid: true,
      coupon: decoded,
      message: "Cupom válido",
      expiresAt: new Date(decoded.exp * 1000),
    });
  } catch (error) {
    let errorMessage = "Cupom inválido";

    if (error.name === "TokenExpiredError") {
      errorMessage = "Cupom expirado";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Cupom inválido ou corrompido";
    }

    return res.status(400).json({
      valid: false,
      error: errorMessage,
    });
  }
}
