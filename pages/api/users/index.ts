import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

// Handler para rotas POST e GET
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password, isAdmin } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10); 

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword, 
          isAdmin,
        },
      });
      res.status(201).json("User created!");
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user', details: error });
    }
  } else if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          imgUser: true,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users', details: error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}