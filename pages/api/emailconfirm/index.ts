import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import initCors from "../../../lib/cors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Inicializa o CORS
  await initCors(req, res);

  // Verifica se a requisição é do tipo POST
  if (req.method === "POST") {
    const { email } = req.body;

    // Verifica se o e-mail foi fornecido
    if (!email) {
      return res.status(400).json({ message: "Email não fornecido." });
    }

    try {
      // Cria o transporte de e-mail com nodemailer
      const transponder = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      console.log("Transportador de e-mail criado com sucesso.");

      // Gera o código de confirmação
      const cod = generateRandomString();
      console.log("Código gerado:", cod);

      // Configura as opções do e-mail
      const emailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Código de confirmação",
        text: cod,
      };

      // Envia o e-mail
      console.log("Tentando enviar e-mail para:", email);

      transponder.sendMail(emailOptions, (error, info) => {
        if (error) {
          console.error("Erro no envio do e-mail:", error);
          return res.status(500).json({ message: "Erro no envio do email.", error: error.message });
        }

        console.log("E-mail enviado com sucesso:", info);
        res.status(201).json(cod);
      });

    } catch (error) {
      console.error("Erro inesperado:", error);
      res.status(500).json({ message: "Erro inesperado ao processar o envio do email.", error: error });
    }

  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Função para gerar um código aleatório de confirmação
function generateRandomString(length = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
