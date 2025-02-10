import axios from "axios";
import api from "../lib/api";

interface useAddRegistered {
  authenticationAddRegistered: (RegisteredAdd: createRegistered) => Promise<string>;
}

export type createRegistered = {
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
}

export const usePostRegistered = (): useAddRegistered => {

  const authenticationAddRegistered = async (RegisteredAdd: createRegistered) => {
    try {
      const response = await api.post('registered/', {
        phoneNumber: RegisteredAdd.phoneNumber,
        birthDate: RegisteredAdd.birthDate, 
        cpf: RegisteredAdd.cpf,
        allergy: RegisteredAdd.allergy,
        allergyDetails: RegisteredAdd.allergyDetails,
        medication: RegisteredAdd.medication,
        medicationDetails: RegisteredAdd.medicationDetails,
        guardianName: RegisteredAdd.guardianName,
        city: RegisteredAdd.city,
        state: RegisteredAdd.state,
        neighborhood: RegisteredAdd.neighborhood,
        zipCode: RegisteredAdd.zipCode,
        number: RegisteredAdd.number,
        referencePoint: RegisteredAdd.referencePoint,
        userId: RegisteredAdd.userId,
        sex: RegisteredAdd.sex,
        numberEmergency: RegisteredAdd.numberEmergency,
        plan: RegisteredAdd.plan
      });

      return response.data
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          console.log(error.response.data)
          if(typeof error.response.data.error === "string"){
            return error.response.data.error;
          }else{
            return "Algum campo errado"
          }
        } else {
          return "servidor erro";
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }

  };

  return { authenticationAddRegistered };
};