import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
  
    if (req.method === 'GET') {
      try {
        const registered = await prisma.registered.findUnique({
          where: { id: Number(id) },
        });
  
        if (registered) {
          res.status(200).json(registered);
        } else {
          res.status(404).json({ error: 'Registered user not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch registered user', details: error });
      }
    } else if (req.method === 'PUT') {
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
        /* eslint-disable @typescript-eslint/no-unused-vars */
        res.status(200).json("Registered changed");
      } catch (error) {
        res.status(500).json({ error: 'Failed to update registered user', details: error });
      }
    } else if (req.method === 'DELETE') {
      try {
        await prisma.registered.delete({
          where: { id: Number(id) },
        });
        res.status(204).end("Deleted Registered");
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete registered user', details: error });
      }
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
  }