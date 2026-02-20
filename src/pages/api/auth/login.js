import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '@/db'; // Importe sua instância do Drizzle
import { users } from '@/db/schema'; // Importe o schema da sua tabela user
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { username, password } = req.body;

  try {
    // 1. Buscar o usuário no banco usando Drizzle
    // Buscamos o primeiro registro onde o username seja igual ao enviado
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    // 2. Validar existência do usuário
    if (!user) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    // 3. Comparar a senha enviada com o hash salvo (coluna password no banco)
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    // 4. Gerar o Token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role || 'admin' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // 5. Retornar os dados para o frontend
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}