import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import initCors from '../../../lib/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await initCors(req, res);
    const { id } = req.query;
  
    if (req.method === 'GET') {
      try {
        const payment = await prisma.payment.findUnique({
          where: { id: Number(id) },
        });
  
        if (payment) {
          res.status(200).json(payment);
        } else {
          res.status(404).json({ error: 'Payment not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment', details: error });
      }
    } else if (req.method === 'PUT') {
      const { amount, method, quantity, isPaid, resAdmin } = req.body;
  
      try {
        const updatedPayment = await prisma.payment.update({
          where: { id: Number(id) },
          data: { amount, method, quantity, isPaid, resAdmin },
        });
        res.status(200).json(updatedPayment);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update payment', details: error });
      }
    } else if (req.method === 'DELETE') {
      try {
        await prisma.payment.delete({ where: { id: Number(id) } });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete payment', details: error });
      }
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }