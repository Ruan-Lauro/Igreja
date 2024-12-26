import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

// Inicializa o middleware de CORS
const cors = Cors({
  origin: 'https://acampamento2025adv.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Helper para executar middlewares no Next.js
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, callback: (result: unknown) => void) => void
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default function initCors(req: NextApiRequest, res: NextApiResponse): Promise<unknown> {
  return runMiddleware(req, res, cors);
}
