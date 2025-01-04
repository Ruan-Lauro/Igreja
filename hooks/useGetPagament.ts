import axios from "axios";
import api from "../lib/api";

interface useGetPagament {
  authenticationGetPagament: () => Promise<pagament[]>;
}

export type pagament = {
    id: number;
    amount: number;
    method: string;
    quantity: number;
    isPaid: boolean;
    userId: number;
    registeredId: number;
    createdAt: Date;
    updatedAt: Date;
    resAdmin: string;
    checking: string;
    numbPayment: number;
    twoMethod?: string,
}

export const useGetPagament = (): useGetPagament => {

  const authenticationGetPagament = async () => {
    try {
      const response = await api.get('payment/');

      return response.data
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "Pagament erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }

  };

  return { authenticationGetPagament };
};