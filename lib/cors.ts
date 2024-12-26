import Cors from 'cors';

// Inicializa o middleware de CORS
const cors = Cors({
  origin: 'https://acampamento2025adv.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
});

// Helper para executar middlewares no Next.js
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default function initCors(req: any, res: any) {
  return runMiddleware(req, res, cors);
}
