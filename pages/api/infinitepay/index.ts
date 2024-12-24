import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { amount, installments, cardToken, email, paymentMethodId } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valor da transação inválido' });
      }

      if (!installments || installments < 1) {
        return res.status(400).json({ error: 'Número de parcelas inválido' });
      }

      if (!cardToken || !email || !paymentMethodId) {
        return res.status(400).json({ error: 'Dados do pagamento incompletos' });
      }

      const paymentData = {
        transaction_amount: amount,
        token: cardToken,
        installments: installments,
        payment_method_id: "master",
        payer: { 
          email: email
        },
      };

      const response = await axios.post(
        'https://api.mercadopago.com/v1/payments',
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'X-Idempotency-Key': uuidv4(), 
          },
        }
      );

      return res.status(200).json({
        id: response.data.id,
        status: response.data.status,
        statusDetail: response.data.status_detail,
      });

    } catch (error) {
      console.error('Erro ao processar pagamento:', error.response?.data || error.message);
      if (error.response) {
        console.error('Código de status:', error.response.status);
        console.error('Resposta do Mercado Pago:', error.response.data);

        res.status(error.response.status || 500).json({
          error: error.response.data || 'Erro interno do servidor',
        });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  } else {
    return res.status(405).json({ error: 'Método não permitido' });
  }
}


