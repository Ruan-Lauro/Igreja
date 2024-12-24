import axios from "axios";
import api from "../lib/api";

interface useAddPagament {
  authenticationAddPagament: (PagamentAdd: createPagament) => Promise<string>;
}

export type createPagament = {
    amount: number;
    method: string;
    quantity: number;
    isPaid: boolean;
    resAdmin: string;
    checking: string;
    numbPayment: number;
    registeredId: number;
    twoMethod?: string;
}

export const usePostPagament = (): useAddPagament => {

  const authenticationAddPagament = async (PagamentAdd: createPagament) => {
    try {

      console.log(PagamentAdd)

      const response = await api.post('payment/', {
        amount: PagamentAdd.amount,
        method: PagamentAdd.method,
        quantity: PagamentAdd.quantity,
        isPaid: PagamentAdd.isPaid,
        resAdmin: PagamentAdd.resAdmin,
        checking: PagamentAdd.checking,
        numbPayment: PagamentAdd.numbPayment,
        registeredId: PagamentAdd.registeredId,
        twoMethod: PagamentAdd.twoMethod
      });

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

  return { authenticationAddPagament };
};