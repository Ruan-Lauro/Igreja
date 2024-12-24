import axios from "axios";
import api from "../lib/api";

interface useLogin {
  authenticationLogin: (login: login) => Promise<string>;
}

// export type inforUser = {
//     name: string;
//     email: string;
//     id: number;
//     isAdmin: boolean;
// }

export type login = {
    email: string;
    password: string;
}

export const useLogin = (): useLogin => {

  const authenticationLogin = async (login: login) => {
    try {
      const response = await api.post('login/', {
        email: login.email,
        password: login.password
      });

      return response.data
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        if(error.status == 404 || error.status == 401){
            return "E-mail ou senha errada"
        }else if(error.status == 500){
            return "Erro Geral"
        }else{
            return "Erro no sistema"
        }
        
      } else {
        console.error('Erro desconhecido:', error)
      }
    }

  };

  return { authenticationLogin };
};