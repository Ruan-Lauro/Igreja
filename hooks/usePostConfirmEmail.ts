import axios from "axios";
import api from "../lib/api";

interface useConfirmEmail {
  authenticationConfirmEmail: (confirm: email) => Promise<string>;
}

export type email = {
    email: string;
}

export const usePostConfirmEmail = (): useConfirmEmail => {

  const authenticationConfirmEmail = async (confirm: email) => {
    try {
      const response = await api.post('emailconfirm/', {
        email: confirm.email,
      });
      return response.data
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "Email erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }

  };

  return { authenticationConfirmEmail };
};