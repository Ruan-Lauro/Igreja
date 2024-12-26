import axios from "axios";
import api from "../lib/api";

interface usePutUser {
  authenticationPutUser: (UserPut: putUser) => Promise<string>;
}

export type putUser = {
  id: number;
  name?: string;
  email?: string;
  imgUser?: string;
}

export const usePutUser = (): usePutUser => {

  const authenticationPutUser = async (UserPut: putUser) => {
    try {
      const response = await api.put(`users/${UserPut.id}`, {
        name: UserPut.name,
        email: UserPut.email,
        imgUser: UserPut.imgUser,
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

  return { authenticationPutUser };
};