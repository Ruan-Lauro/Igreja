import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import initCors from '../../../lib/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initCors(req, res);
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Criar uma cópia do usuário sem a senha
      const userData: Omit<typeof user, 'password'> = {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        imgUser: user.imgUser,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to login', details: error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

