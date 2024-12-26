import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function installment(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { value, cardFlag } = req.body;

    try {
      const response = await axios.get(
        `https://api.mercadopago.com/v1/payment_methods/installments?amount=${value}&bin=${cardFlag}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`, 
          },
        }
      );
      console.log("Aquii:")
      console.log(response.data)

      if (response.data && response.data.length > 0) {
        const options = response.data[0].payer_costs.map((cost: { installments: string; total_amount: number; recommended_message: string; }) => ({
          installments: cost.installments,
          total: cost.total_amount,
          message: cost.recommended_message,
        }));

        return res.status(200).json(options);
      } else {
        console.warn("Nenhuma parcela disponível", response.data);
        return res.status(200).json([]); 
      }
    } catch (error) {
      console.error("Erro ao buscar parcelas:", error);
      return res.status(500).json({ error: "Erro interno ao buscar parcelas" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
