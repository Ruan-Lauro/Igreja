import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        console.log("🔔 Notificação recebida:", req.body);
        return res.status(200).json({ message: "Webhook recebido com sucesso!" });
    }

    return res.status(405).json({ message: "Método não permitido" });
}
