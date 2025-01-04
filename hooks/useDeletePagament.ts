import axios from "axios";
import api from "../lib/api";

interface useDeletePagament {
  authenticationDeletePagament: (PagamentDelete: deletePagament) => Promise<string>;
}

export type deletePagament = {
    id: number;
}

export const useDeletePagament = (): useDeletePagament => {

  const authenticationDeletePagament = async (PagamentDelete: deletePagament) => {
    try {
      const response = await api.delete(`payment/${PagamentDelete.id}`, {
        
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

  return { authenticationDeletePagament };
};