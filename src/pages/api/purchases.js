import { db } from "@/db";
import { purchases } from "@/db/schema";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const all = await db.select().from(purchases).orderBy(purchases.createdAt);
      return res.status(200).json(all);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return res.status(500).json({ error: "Erro ao processar requisição" });
  }
}