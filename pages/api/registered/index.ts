import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import initCors from '../../../lib/cors';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      await initCors(req, res);
    if (req.method === 'POST') {
      const {
        phoneNumber,
        birthDate,
        cpf,
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
        userId,
        sex,
        plan,
        numberEmergency
      } = req.body;
  
      try {
        await prisma.registered.create({
          data: {
            phoneNumber,
            birthDate: new Date(birthDate),
            cpf,
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
            userId,
            sex,
            numberEmergency,
            plan,
          },
        });
        /* eslint-disable @typescript-eslint/no-unused-vars */
        res.status(201).json("Create Registered!!");
      } catch (error) {
        res.status(500).json({ error: 'Failed to create registered user', details: error });
      }
    } else if (req.method === 'GET') {
      try {
        const registered = await prisma.registered.findMany();
        res.status(200).json(registered);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch registered users', details: error });
      }
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  