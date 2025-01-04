import axios from "axios";
import api from "../lib/api";

interface usePutPagament {
  authenticationPutPagament: (PagamentPut: putPagament) => Promise<string>;
}

export type putPagament = {
    id: number;
    resAdmin?: string;
    isPaid?: boolean;
    quantity?: number;
    method?: string;
    amount?: number;
}

export const usePutPagament = (): usePutPagament => {

  const authenticationPutPagament = async (PagamentPut: putPagament) => {
    try {
      const response = await api.put(`payment/${PagamentPut.id}`, {
        resAdmin: PagamentPut.resAdmin,
        isPaid: PagamentPut.isPaid,
        quantity: PagamentPut.quantity,
        method: PagamentPut.method,
        amount: PagamentPut.amount
        
      });

      return response.data
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          return error.response.data.error
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }

  };

  return { authenticationPutPagament };
};