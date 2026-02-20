import jwt from "jsonwebtoken";
import { db } from "@/db";
import { purchases, coupons } from "@/db/schema";
import { leads as leadsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const generateCoupon = (cnpj) => {
  // Create JWT token with CNPJ as the key
  // Token includes:
  // - CNPJ (for validation)
  // - Expiration (30 days from now)
  // - Issue date
  // - Trial period (30 days free)

  const expiresIn = "7d"; // 30 days

  const token = jwt.sign(
    {
      cnpj,
      type: "trial",
      freeTrialDays: 30,
      issuedAt: new Date().toISOString(),
    },
    JWT_SECRET,
    { expiresIn }
  );

  return token;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { cnpj, items, total } = req.body;

  if (!cnpj || !items || items.length === 0 || total === undefined) {
    return res.status(400).json({ error: "Dados inválidos para checkout" });
  }

  try {
    // Decide purchase status from optional payment info
    // If caller provides payment.status === 'approved', only then generate coupon
    const paymentInfo = req.body.payment || null;
    const paymentStatus = paymentInfo?.status || "pending";

    // Save purchase record with status reflecting payment
    const purchaseResult = await db
      .insert(purchases)
      .values({
        cnpj,
        items: JSON.stringify(items),
        total: parseFloat(total),
        status: paymentStatus,
        mercadopagoId: paymentInfo?.id || null,
      })
      .returning();

    const purchaseId = purchaseResult[0].id;

    let couponToken = null;
    if (paymentStatus === "approved") {
      // Generate JWT coupon
      couponToken = generateCoupon(cnpj);

      // Calculate expiration date (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Save coupon
      await db.insert(coupons).values({
        token: couponToken,
        cnpj,
        purchaseId,
        freeTrialDays: 30,
        isUsed: false,
        expiresAt,
      });
    }

    // Update lead with purchase info if it exists
    try {
      const lead = await db
        .select()
        .from(leadsTable)
        .where(eq(leadsTable.cnpj, cnpj))
        .limit(1);

      if (lead.length > 0) {
        // Lead exists, just update timestamp or mark as customer
        // (optional, depending on your business logic)
      }
    } catch (leadError) {
      console.error("Error updating lead:", leadError);
      // Continue even if lead update fails
    }

    return res.status(200).json({
      success: true,
      purchaseId,
      status: paymentStatus,
      coupon: couponToken,
      message: paymentStatus === "approved" ? "Compra aprovada e cupom gerado." : "Compra registrada; aguarde confirmação de pagamento.",
    });
  } catch (error) {
    console.error("Erro durante checkout:", error);
    return res.status(500).json({ error: "Erro ao processar a compra" });
  }
}
