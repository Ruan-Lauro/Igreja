"use client"

import { InputTwo } from "@/components/inputTwo";
import { Menu } from "@/components/Menu";
import { SelectInput } from "@/components/SelectInput";
import { useGetRegistered } from "@/hooks/useGetRegistered";
import { users } from "@/hooks/useGetUsers";
import { usePostRegistered } from "@/hooks/usePostRegistered";
import { Registered } from "@prisma/client";
import { redirect } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import { usePutRegistered } from "@/hooks/usePutRegistered";
import { Loading } from "@/components/Loading";
import { getCookie } from "@/lib/cookie";

export default function Register() {

  //User
  const [user, setUser] = useState<users>();

  //Register Form
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cpf, setCpf] = useState("");
  const [sex, setSex] = useState("M");
  const [allergy, setAllergy] = useState("");
  const [allergyDetails, setAllergyDetails] = useState("");
  const [medication, setMedication] = useState("");
  const [medicationDetails, setMedicationDetails] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [number, setNumber] = useState("");
  const [referencePoint, setReferencePoint] = useState("");
  const [numberEmergency, setNumberEmergency] = useState("");
  const [plan, setPlan] = useState("Normal");
  const [registered, setRegistered] = useState<Registered>();
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  //Erro
  const [erroRegister, setErroRegister] = useState("");

  //hooks
  const {authenticationAddRegistered} = usePostRegistered();
  const {authenticationRegistered} = useGetRegistered();
  const {authenticationPutRegistered} = usePutRegistered();

  const handlePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.currentTarget.value);
  };

  const handleBirthDate = (e: ChangeEvent<HTMLInputElement>) => {
    setBirthDate(e.currentTarget.value);
  };

  const handleCpf = (e: ChangeEvent<HTMLInputElement>) => {
    setCpf(e.currentTarget.value);
  };

  const handleSex = (e: ChangeEvent<HTMLSelectElement>) => {
    setSex(e.currentTarget.value);
  };

  const handleAllergy = (e: ChangeEvent<HTMLSelectElement>) => {
    setAllergy(e.currentTarget.value);
  };

  const handleAllergyDetails = (e: ChangeEvent<HTMLInputElement>) => {
    setAllergyDetails(e.currentTarget.value);
  };

  const handleMedication = (e: ChangeEvent<HTMLSelectElement>) => {
    setMedication(e.currentTarget.value);
  };

  const handleNumberEmergency = (e: ChangeEvent<HTMLInputElement>) => {
    setNumberEmergency(e.currentTarget.value);
  };

  const handleMedicationDetails = (e: ChangeEvent<HTMLInputElement>) => {
    setMedicationDetails(e.currentTarget.value);
  };

  const handleGuardianName = (e: ChangeEvent<HTMLInputElement>) => {
    setGuardianName(e.currentTarget.value);
  };

  const handlePlan = (e: ChangeEvent<HTMLSelectElement>) => {
    setPlan(e.currentTarget.value);
  };

  const handleCity = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.currentTarget.value);
  };

  const handleState = (e: ChangeEvent<HTMLInputElement>) => {
    setState(e.currentTarget.value);
  };

  const handleNeighborhood = (e: ChangeEvent<HTMLInputElement>) => {
    setNeighborhood(e.currentTarget.value);
  };

  const handleZipCode = (e: ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.currentTarget.value);
  };

  const handleNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setNumber(e.currentTarget.value);
  };

  const handleReferencePoint = (e: ChangeEvent<HTMLInputElement>) => {
    setReferencePoint(e.currentTarget.value);
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date(); 
    const birth = new Date(birthDate); 
    
    let age = today.getFullYear() - birth.getFullYear(); 
  
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
  
    const birthMonth = birth.getMonth();
    const birthDay = birth.getDate();
  
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age--; 
    }
    return age;
  };

  useEffect(()=>{
    setUpdate(!update);
  },[])

  useEffect(() => {
   
    const element = getCookie("users");


    if (element) {
     
        try {
            const parsedUser = element;
            if (parsedUser && typeof parsedUser === "object") {
             
                setLoading(true);
                setUser(parsedUser);
                const listRegis = authenticationRegistered();
             
                listRegis.then(val=>{
                  
                    const listNew = val.filter(on=> on.userId === parsedUser.id);
                    
                    if(listNew[0]){
                    
                      setRegistered(listNew[0]);
                      setLoading(false);
                    }else{
                    
                        setLoading(false);
                    }
                }); 
                
            }
        } catch (error) {
            console.error("Erro ao parsear o JSON:", error);
        }
    }
}, [update]);

  useEffect(() => {
    if (registered) {
      setCpf(registered.cpf);
      setPhoneNumber(registered.phoneNumber);
      setBirthDate(format(new Date(registered.birthDate), "yyyy-MM-dd"));
      setSex(registered.sex);
      setState(registered.state);
      setCity(registered.city);
      setNeighborhood(registered.neighborhood);
      setZipCode(registered.zipCode);
      setReferencePoint(registered.referencePoint);
      setNumber(registered.number);
      setNumberEmergency(registered.numberEmergency);
      setGuardianName(registered.guardianName || "");
      setMedication(registered.medication ? "Sim" : "Não");
      setMedicationDetails(registered.medicationDetails || "");
      setAllergy(registered.allergy ? "Sim" : "Não");
      setAllergyDetails(registered.allergyDetails || "");
      setPlan(registered.plan);
    }
  }, [registered]);

  const handleFormRegister = (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    setLoading(true);
    if (cpf.length !== 11) {
        setErroRegister("CPF deve ter 11 caracteres");
        setLoading(false);
        return;
    }

    if (phoneNumber.length !== 11) {
        setErroRegister("Número de telefone deve ter 11 caracteres");
        setLoading(false);
        return;
    }

    if (numberEmergency.length !== 11) {
        setErroRegister("Número de emergência deve ter 11 caracteres");
        setLoading(false);
        return;
    }

    if (zipCode.length !== 8) {
        setErroRegister("CEP deve ter 8 caracteres");
        setLoading(false);
        return;
    }

    if (!user) {
        setErroRegister("Por algum motivo não tem usuário");
        setLoading(false);
        redirect(`/`);
    }

    setErroRegister("");

    const registerUser = {
        phoneNumber: phoneNumber,
        birthDate: new Date(birthDate), 
        cpf: cpf,
        allergy: allergy === "Sim"?true:false,
        allergyDetails: allergyDetails,
        medication: medication == "Sim"?true:false,
        medicationDetails: medicationDetails,
        guardianName: guardianName,
        city: city,
        state: state,
        neighborhood: neighborhood,
        zipCode: zipCode,
        number: number,
        referencePoint: referencePoint,
        userId: user?.id,
        sex: sex,
        numberEmergency: numberEmergency,
        plan: plan,
    }

    const res = authenticationAddRegistered(registerUser);

    res.then(value=>{
        if(value === "Create Registered!!"){
            setLoading(false);
            redirect("/Pagament/")
        }else{
          setLoading(false)
          setErroRegister(value);
        }
    })
    
  }

  const handleEditFormRegister = (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    setLoading(true);
    if (cpf.length !== 11) {
        setErroRegister("CPF deve ter 11 caracteres");
        setLoading(false);
        return;
    }

    if (phoneNumber.length !== 11) {
        setErroRegister("Número de telefone deve ter 11 caracteres");
        setLoading(false);
        return;
    }

    if (numberEmergency.length !== 11) {
        setErroRegister("Número de emergência deve ter 11 caracteres");
        setLoading(false);
        return;
    }

    if (zipCode.length !== 8) {
        setErroRegister("CEP deve ter 8 caracteres");
        setLoading(false);
        return;
    }

    if (!user) {
        setErroRegister("Por algum motivo não tem usuário");
        setLoading(false);
        redirect(`/`);
    }

    if(!registered){
      alert("Erro no registered");
      return;
    }

    setErroRegister("");

    const registerUser = {
        id: registered.id,
        phoneNumber: phoneNumber,
        birthDate: new Date(birthDate), 
        cpf: cpf,
        allergy: allergy === "Sim"?true:false,
        allergyDetails: allergyDetails,
        medication: medication == "Sim"?true:false,
        medicationDetails: medicationDetails,
        guardianName: guardianName,
        city: city,
        state: state,
        neighborhood: neighborhood,
        zipCode: zipCode,
        number: number,
        referencePoint: referencePoint,
        userId: user?.id,
        sex: sex,
        numberEmergency: numberEmergency,
        
    }

    const res = authenticationPutRegistered(registerUser);

    res.then(value=>{
        if(value === "Registered changed"){
          setLoading(false);
        }else{
          setErroRegister(value);
          setLoading(false);
        }
    })
    
  }

    return(
        <main className="bg-[#697565] h-full w-full flex relative " >
          {loading?(
            <Loading/>
          ):null}
           <Menu value="4" isAdmin={user?.isAdmin || false}/>
           <div className="w-full flex flex-col items-center justify-center mt-20 md:mt-5 md:ml-[120px]" >
                <div className="w-[90%] xl:w-[70%] flex flex-col mt-10 text-[#ECDFCC] md:mt-5" >
                    <h2 className="text-[30px] text-center xl:text-start xl:text-[40px] font-bold" >{registered?"Inscrição feita":"Faça sua inscrição"} para o acampamento 2025</h2>
                    <p className="xl:text-[18px] text-justify mt-5 xl:mt-0" >Responda e analise se está tudo correto. Criança de 6 anos para baixo paga 2 reais (valor do seguro), se essa é sua condição, então encolha o maternal; se você tem de 7 a 10 anos, então escolha o plano infantil; se você está acima de 10 anos, então escolha o plano normal; se você mora a mais de 100km de distância, então escolha o plano distante; e por fim, se você só quer ir por um dia, escolha a diária de 35 reais. Não pode usar o mesmo CPF em duas contas ou número de telefone.</p>
                </div>
                <form onSubmit={!registered?handleFormRegister:handleEditFormRegister} className="w-[90%] xl:w-[70%] mt-[25px] flex flex-col" >
                    <div className="md:grid md:grid-cols-2 xl:flex items-center justify-between xl:gap-5 gap-2 w-full flex xl:flex-row flex-col" >
                        <InputTwo value={cpf} name={cpf} placeholder="CPF" onchange={handleCpf} required type="number" erro={false} id="1"  />
                        <InputTwo value={phoneNumber} name={phoneNumber} placeholder="Telefone" onchange={handlePhoneNumber} required type="number" erro={false} id="2" />
                        <InputTwo value={birthDate} name={birthDate} placeholder="Data de nascimento" onchange={handleBirthDate} required type="date" erro={false} id="3" />
                        <SelectInput value={sex} name={sex} onchange={handleSex} id="4" options={["M","F"]} placeholder="Sexo*" erro required/>
                    </div>
                    <div className="md:grid md:grid-cols-2 xl:flex w-full flex xl:flex-row flex-col items-center justify-between xl:gap-5 gap-2 mt-5" >
                        <InputTwo value={state} name={state} placeholder="Estado" onchange={handleState} required type="text" erro={false} id="5" />
                        <InputTwo value={city} name={city} placeholder="Cidade" onchange={handleCity} required type="text" erro={false} id="6" />
                        <InputTwo value={neighborhood} name={neighborhood} placeholder="Bairro" onchange={handleNeighborhood} required type="text" erro={false} id="7" />
                        <InputTwo value={zipCode} name={zipCode} placeholder="CEP" onchange={handleZipCode} required type="number" erro={false} id="8"  />
                    </div>
                    <div className="md:grid md:grid-cols-2 xl:flex w-full flex xl:flex-row flex-col items-center justify-between xl:gap-5 gap-2 mt-5" >
                        <InputTwo value={number} name={number} placeholder="Número" onchange={handleNumber} required type="number" erro={false} id="9" />
                        <InputTwo value={referencePoint} name={referencePoint} placeholder="Ponto de Referência" onchange={handleReferencePoint} required type="text" erro={false} id="10" />
                        <InputTwo value={guardianName} name={guardianName} placeholder="Nome do responsável" onchange={handleGuardianName} required={calculateAge(birthDate) < 18} type="text" erro={false} id="11" />
                    </div>
                    <div className="md:grid md:grid-cols-2 xl:flex w-full flex xl:flex-row flex-col items-center justify-between xl:gap-5 gap-2 mt-5" >
                        <SelectInput value={medication} name={medication} onchange={handleMedication} id="4" options={["Sim","Não"]} placeholder="Toma algum medicamento?" erro required/>
                        <InputTwo value={medicationDetails} name={medicationDetails} placeholder="Qual medicamento toma?" onchange={handleMedicationDetails} required={medication !== "Não"} type="text" erro={false} id="12" />
                        <InputTwo value={numberEmergency} name={numberEmergency} placeholder="Número de emergência" onchange={handleNumberEmergency} required type="number" erro={false} id="12" />
                    </div>
                    <div className="md:grid md:grid-cols-2 xl:flex w-full flex xl:flex-row flex-col items-center justify-between xl:gap-5 gap-2 mt-5" >
                        <SelectInput value={allergy} name={allergy} onchange={handleAllergy} id="4" options={["Sim","Não"]} placeholder="Tem alergia?" erro required />
                        <InputTwo value={allergyDetails} name={allergyDetails} placeholder="Tem alergia a quê?" onchange={handleAllergyDetails} required={allergy !== "Não"} type="text" erro={false} id="12" />
                        {!registered?(
                          <SelectInput value={plan} name={plan} onchange={handlePlan} id="13" options={["Normal", "Maternal","Infantil", "Distante", "Diaria"]} placeholder="Pagamento" erro required />
                        ):null}
                    </div>
                    {referencePoint !== ""?(
                        <p className="text-[#CF0E0E] mt-[10px] font-bold" >{erroRegister}</p>
                    ):null}
                    <button className="bg-[#3C3D37] hover:bg-black/40 w-[140px] h-[50px] rounded-[10px] text-[#ECDFCC] font-bold mt-[20px] self-center xl:self-start mb-2">
                        {registered?"EDITAR":"REGISTRAR"}
                    </button>
                </form>

           </div>
        </main>
    );
}