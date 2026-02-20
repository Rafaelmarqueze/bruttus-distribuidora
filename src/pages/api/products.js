import { db } from "@/db";
import { products as productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const all = await db.select().from(productsTable).orderBy(productsTable.createdAt);
      return res.status(200).json(all);
    }

    if (req.method === "POST") {
      const { name, description, price, imageUrl } = req.body;
      if (!name || price === undefined) {
        return res.status(400).json({ error: "Nome e preço são obrigatórios" });
      }
      const newProd = await db
        .insert(productsTable)
        .values({
          name,
          description: description || null,
          price: parseFloat(price),
          imageUrl: imageUrl || null,
        })
        .returning();
      return res.status(201).json(newProd[0]);
    }

    if (req.method === "PUT") {
      const { id, name, description, price, imageUrl } = req.body;
      if (!id) return res.status(400).json({ error: "ID do produto é obrigatório" });
      const updated = await db
        .update(productsTable)
        .set({
          name,
          description: description || null,
          price: price !== undefined ? parseFloat(price) : undefined,
          imageUrl: imageUrl || null,
        })
        .where(eq(productsTable.id, Number(id)))
        .returning();
      return res.status(200).json(updated[0]);
    }

    if (req.method === "DELETE") {
      const id = req.query.id || req.body?.id;
      if (!id) return res.status(400).json({ error: "ID do produto é obrigatório" });
      await db.delete(productsTable).where(eq(productsTable.id, Number(id)));
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Products API error:", error);
    return res.status(500).json({ error: "Erro ao processar requisição" });
  }
}