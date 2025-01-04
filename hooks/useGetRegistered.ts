import axios from "axios";
import api from "../lib/api";

export type registered = {
    birthDatetoLocaleDateString(arg0: string, arg1: { weekday: string; year: string; month: string; day: string; }): import("react").ReactNode;
    id: number;
    phoneNumber: string;
    birthDate: Date; 
    cpf: string;
    allergy: boolean;
    allergyDetails: string | null;
    medication: boolean;
    medicationDetails: string | null;
    guardianName: string;
    city: string;
    state: string;
    neighborhood: string;
    zipCode: string;
    number: string;
    referencePoint: string;
    userId: number;
    sex: string;
    numberEmergency: string;
    plan: string;
  };

interface useGetRegistered {
    authenticationRegistered: () => Promise<registered[]>;
}

export const useGetRegistered = (): useGetRegistered => {

  const authenticationRegistered = async () => {
    try {
      const response = await api.get('registered/');
      return response.data
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "Registered erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }

  };

  return { authenticationRegistered };
};