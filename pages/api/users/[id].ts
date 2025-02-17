import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import initCors from '../../../lib/cors';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initCors(req, res);
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user', details: error });
    }
  } else if (req.method === 'PUT') {
    const { name, email, password, isAdmin, imgUser } = req.body;

    try {
     
      if(email){
        const existingUser = await prisma.user.findFirst({
          where: {
            email,
            id: { not: Number(id) },
          },
        });
  
        if (existingUser) {
          return res.status(400).json({ error: 'E-mail já está em uso por outro usuário' });
        }
      }

       const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: Number(id) },
        data: { name, email, password:hashedPassword, isAdmin, imgUser },
      });

      res.status(200).json('User edited');
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user', details: error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.user.delete({ where: { id: Number(id) } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user', details: error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
