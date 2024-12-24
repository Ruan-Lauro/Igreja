import axios from "axios";
import api from "../lib/api";

export type users = {
  name: string;
  email: string;
  isAdmin: boolean;
  id:  number;
  imgUser?: string; 
}

interface useGetUsers {
  authenticationUsers: () => Promise<users[]>;
}

export const useGetUsers = (): useGetUsers => {

  const authenticationUsers = async () => {
    try {
      const response = await api.get('users/');
      return response.data
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "user erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }

  };

  return { authenticationUsers };
};