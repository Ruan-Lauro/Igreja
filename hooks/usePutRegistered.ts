import axios from "axios";
import api from "../lib/api";

interface usePutRegistered {
  authenticationPutRegistered: (RegisteredPut: putRegistered) => Promise<string>;
}

export type putRegistered = {
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
}

export const usePutRegistered = (): usePutRegistered => {

  const authenticationPutRegistered = async (RegisteredPut: putRegistered) => {
    try {
      const response = await api.put(`registered/${RegisteredPut.id}`, {
        phoneNumber: RegisteredPut.phoneNumber,
        birthDate: RegisteredPut.birthDate, 
        cpf: RegisteredPut.cpf,
        allergy: RegisteredPut.allergy,
        allergyDetails: RegisteredPut.allergyDetails,
        medication: RegisteredPut.medication,
        medicationDetails: RegisteredPut.medicationDetails,
        guardianName: RegisteredPut.guardianName,
        city: RegisteredPut.city,
        state: RegisteredPut.state,
        neighborhood: RegisteredPut.neighborhood,
        zipCode: RegisteredPut.zipCode,
        number: RegisteredPut.number,
        referencePoint: RegisteredPut.referencePoint,
        sex: RegisteredPut.sex,
        numberEmergency: RegisteredPut.numberEmergency,
        plan: RegisteredPut.plan
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

  return { authenticationPutRegistered };
};