import { ChangeEvent, FormEvent,  useState } from "react";
import { AuthInput } from "../input";
// import { usePostConfirmEmail } from "@/hooks/usePostConfirmEmail";
import React from "react";

type email = {
    autheConfirm: () => void;
    exitConfirm: () => void;
}

export const EmailPassword = ({ exitConfirm, autheConfirm}:email) => {

    const [codEmail, setCodEmail] =  useState("");
    const [erroR, setErroR] = useState("");

    const [inforCodEmail, setInfoCodEmail] = useState(false);

    const handleCodEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setCodEmail(e.currentTarget.value);
    };
    

    const handleEmail = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(codEmail){
            setErroR("");
            setInfoCodEmail(true);
            autheConfirm();
        }
    };

    return(
        <React.Fragment>
             {inforCodEmail?(
                <div>
                    
                </div>
             ):(
                <div className="flex flex-col w-full h-full md:w-[638px] md:h-[543px] bg-[#ECDFCC] text-[#ECDFCC] md:rounded-[25px] items-center justify-center" >
                <h2 className="text-[28px] text-[#3C3D37] font-bold mt-[0px] mb-[40px] w-[70%] text-center" >Escreva seu e-mail para indentificarmos sua conta.</h2>
                <form onSubmit={handleEmail} className="w-[70%] flex flex-col items-center gap-[35px]">
                    <AuthInput erro={erroR == ""? false: true} name={codEmail} onchange={handleCodEmail} placeholder="Escreva seu e-mail" type="text" value={codEmail} id="1" required />
                    <div className="flex gap-3" >
                        <button className="bg-[#3C3D37] w-[173px] h-[58px] rounded-[10px] text-[#ECDFCC] font-bold mt-[10px]">
                            CONFIRMAR
                        </button>
                        <button type="button" onClick={exitConfirm} className="bg-[#3C3D37] w-[173px] h-[58px] rounded-[10px] text-[#ECDFCC] font-bold mt-[10px]">
                            CANCELAR
                        </button>
                    </div>
                </form>
            </div>
             )}
        </React.Fragment>
    );
}