import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { amount, method, quantity, isPaid, registeredId, resAdmin, checking, numbPayment, twoMethod } = req.body;
  
      try {
         await prisma.payment.create({
          data: {
            amount,
            method,
            quantity,
            isPaid,
            resAdmin,
            checking,
            numbPayment,
            registeredId,
            twoMethod,
          },
        });

        
        res.status(201).json("Payment create");
      } catch (error) {
        res.status(500).json({ error: 'Failed to create payment', details: error });
      }
    } else if (req.method === 'GET') {
      try {
        const payments = await prisma.payment.findMany();
        res.status(200).json(payments);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments', details: error });
      }
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }