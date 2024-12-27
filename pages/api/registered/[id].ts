import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import initCors from '../../../lib/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initCors(req, res);
  res.setHeader('Cache-Control', 'no-store');
  const { id } = req.query;

  if (req.method === 'PUT') {
    const {
      phoneNumber,
      birthDate,
      cpf,
      sex,
      allergy,
      allergyDetails,
      medication,
      medicationDetails,
      guardianName,
      city,
      state,
      neighborhood,
      zipCode,
      number,
      referencePoint,
      numberEmergency,
      plan,
      userId,
    } = req.body;

    try {
    
      const existingUser = await prisma.registered.findFirst({
        where: {
          cpf,
          id: { not: Number(id) }, 
        },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'CPF já usado por outro usuário' });
      }

      const existingNumb = await prisma.registered.findFirst({
        where: {
          phoneNumber,
          id: { not: Number(id) }, 
        },
      });

      if (existingNumb) {
        return res.status(400).json({ error: 'Número de telefone já usado por outro usuário' });
      }

      await prisma.registered.update({
        where: { id: Number(id) },
        data: {
          phoneNumber,
          birthDate,
          cpf,
          sex,
          allergy,
          allergyDetails,
          medication,
          medicationDetails,
          guardianName,
          city,
          state,
          neighborhood,
          zipCode,
          number,
          referencePoint,
          numberEmergency,
          plan,
          userId,
        },
      });

      res.status(200).json('Registered changed');
    } catch (error) {
      res.status(500).json({ error: 'Failed to update registered user', details: error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.registered.delete({
        where: { id: Number(id) },
      });
      res.status(204).end('Deleted Registered');
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete registered user', details: error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
