import jwt from "jsonwebtoken";
import { db } from "@/db";
import { purchases, coupons } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const generateCoupon = (cnpj) => {
  const expiresIn = "30d";

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
  // MercadoPago sends webhook notifications as POST requests
  if (req.method === "POST") {
    try {
      // MercadoPago sends notification data in request body
      // Data contains: type (payment), data: { id: payment_id }
      const notification = req.body;

      console.log("Webhook received from MercadoPago:", JSON.stringify(notification, null, 2));

      if (notification.type === "payment" || notification.data?.id) {
        const paymentId = notification.data?.id;

        // Log the payment ID for verification
        console.log("Processing payment:", paymentId);
        // Fetch payment details from MercadoPago to verify status
        try {
          const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
          if (!accessToken) {
            console.error("MERCADOPAGO_ACCESS_TOKEN not configured for webhook processing");
          } else {
            const resp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            const text = await resp.text();
            let paymentData;
            try {
              paymentData = JSON.parse(text);
            } catch (e) {
              console.error("Failed to parse payment details from MercadoPago:", text);
              paymentData = null;
            }

            console.log("Payment details from MercadoPago:", paymentData);

            function mapPaymentMethod(pd) {
              if (!pd) return null;
              const type = pd.payment_type_id || pd.paymentType || (pd.payment && pd.payment.type) || null;
              const installments = Number(pd.installments || 0) || 0;
              if (type === 'pix') return 'pix';
              if (installments && installments > 1) return 'parcelado';
              if (type === 'credit_card' || pd.card) return 'cartao';
              // fallback for transfers or unknown => a vista
              return 'avista';
            }

            if (paymentData && paymentData.status === "approved") {
              // Determine cnpj from external_reference (if present)
              const cnpj = paymentData.external_reference || paymentData.order?.external_reference || null;

              // Avoid duplicate processing: check if purchase with this mercadopagoId exists
              const existing = await db.select().from(purchases).where(eq(purchases.mercadopagoId, String(paymentData.id))).limit(1);
              if (!existing || existing.length === 0) {
                // Create purchase record tied to this payment
                const purchaseResult = await db
                  .insert(purchases)
                  .values({
                    cnpj: cnpj || "",
                    items: JSON.stringify(paymentData.order?.items || []),
                    total: Number(paymentData.transaction_amount) || 0,
                    status: "approved",
                    mercadopagoId: String(paymentData.id),
                    paymentMethod: mapPaymentMethod(paymentData),
                  })
                  .returning();

                const purchaseId = purchaseResult[0].id;

                // Generate coupon for the cnpj if available
                if (cnpj) {
                  const couponToken = generateCoupon(cnpj);
                  const expiresAt = new Date();
                  expiresAt.setDate(expiresAt.getDate() + 30);
                  await db.insert(coupons).values({
                    token: couponToken,
                    cnpj,
                    purchaseId,
                    freeTrialDays: 30,
                    isUsed: false,
                    expiresAt,
                  });
                  console.log("Generated coupon for approved payment", purchaseId);
                }
              } else {
                console.log("Payment already processed, skipping creation", paymentId);
              }
            }
          }
        } catch (e) {
          console.error("Error fetching payment details or processing webhook:", e);
        }
      }

      // Always return 200 to acknowledge receipt and prevent retries
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      // Still return 200 to prevent MercadoPago from retrying
      return res.status(200).json({ received: true, error: error.message });
    }
  }

  // Handle GET requests (exploratory requests from MercadoPago)
  if (req.method === "GET") {
    return res.status(200).json({ status: "webhook active" });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
