import { db } from "@/db";
import { leads as leadsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const allLeads = await db.select().from(leadsTable).orderBy(leadsTable.createdAt);
      return res.status(200).json(allLeads);
    }

    if (req.method === "POST") {
      const { cnpj, name, email, phone, company, message, status } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: "Nome e email são obrigatórios" });
      }

      const newLead = await db
        .insert(leadsTable)
        .values({
          name,
          email,
          phone: phone || null,
          company: company || null,
          message: message || null,
          cnpj: cnpj || null,
          status: status || 'novo'
        })
        .returning();

      return res.status(201).json(newLead[0]);
    }

    if (req.method === "PUT") {
      const { id } = req.query;
      const { cnpj, status } = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID é obrigatório" });
      }

      const updateData = {};
      if (cnpj !== undefined) updateData.cnpj = cnpj;
      if (status !== undefined) updateData.status = status;

      const updatedLead = await db
        .update(leadsTable)
        .set(updateData)
        .where(eq(leadsTable.id, parseInt(id)))
        .returning();

      if (updatedLead.length === 0) {
        return res.status(404).json({ error: "Lead não encontrado" });
      }

      return res.status(200).json(updatedLead[0]);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Erro ao processar requisição" });
  }
}
