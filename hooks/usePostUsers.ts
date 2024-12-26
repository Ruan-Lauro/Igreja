import axios from "axios";
import api from "../lib/api";

interface useAddGroupResult {
  authenticationAddUsers: (groupAdd: createUsers) => Promise<string>;
}

export type createUsers = {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

export const usePostUsers = (): useAddGroupResult => {

  const authenticationAddUsers = async (groupAdd: createUsers) => {
    try {
      const response = await api.post('users/', {
        name: groupAdd.name,
        email: groupAdd.email,
        password: groupAdd.password,
        isAdmin: groupAdd.isAdmin
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

  return { authenticationAddUsers };
};