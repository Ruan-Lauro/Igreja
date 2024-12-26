import nodemailer from "nodemailer"
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email} = req.body;
    try {
        const transponder = nodemailer.createTransport({
          service:'gmail',
          auth:{
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
          }
        })
  
        const cod = generateRandomString()
  
        const emailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject:"Código de confirmação",
          text: cod,
        }
  
        transponder.sendMail(emailOptions, (error)=>{
          if(error){
            res.status(500).json("Erro no envio do email.");
          }
        })

        res.status(201).json(cod);
  
      } catch (error) {
        res.status(500).json(error);
      }

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateRandomString(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
  }