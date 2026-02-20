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

      if (notification.type === "payment" || notification.data?.id) {
        const paymentId = notification.data?.id;

        // Fetch payment details from notification query param or body
        // For simplicity, we'll wait for your system to have payment data
        console.log("Webhook received for payment:", paymentId);

        // In production, you should fetch payment details from MercadoPago API
        // to verify the payment status and details
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
