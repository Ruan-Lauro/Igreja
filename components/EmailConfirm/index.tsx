import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AuthInput } from "../input";
import { usePostConfirmEmail } from "@/hooks/usePostConfirmEmail";

type email = {
    email: string;
    autheConfirm: () => void;
    exitConfirm: () => void;
}

export const EmailConfirm = ({email, autheConfirm, exitConfirm}:email) => {

    const [codEmail, setCodEmail] =  useState("");
    const [erroR, setErroR] = useState("");
    const [resCod, setResCod] = useState("");

    const {authenticationConfirmEmail} = usePostConfirmEmail();

    const handleCodEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setCodEmail(e.currentTarget.value);
    };

    useEffect(() => {
        const value = authenticationConfirmEmail({ email });
        value.then((res) => {
            console.log(res)
            if (res.length === 6) {
                setResCod(res);
            } else {
                setErroR(res);
            }
        });
    }, [email]); 
    

    const handleEmail = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(resCod === codEmail){
            autheConfirm()
        }else{
            setErroR("Código errado!")
        }
    };

    return(
        <div className="flex flex-col w-full h-full md:w-[638px] md:h-[543px] bg-[#ECDFCC] text-[#ECDFCC] md:rounded-[25px] items-center justify-center" >
            <h2 className="text-[28px] text-[#3C3D37] font-bold mt-[0px] mb-[40px] w-[70%] text-center" >Confirme o código que chegou no seu e-mail</h2>
            <form onSubmit={handleEmail} className="w-[70%] flex flex-col items-center gap-[35px]">
                <AuthInput erro={erroR == ""? false: true} name={codEmail} onchange={handleCodEmail} placeholder="Código do e-mail" type="text" value={codEmail} id="1" required />
                <div className="flex gap-3" >
                    <button className="bg-[#3C3D37] w-[173px] h-[58px] rounded-[10px] text-[#ECDFCC] font-bold mt-[10px]">
                        CONFIRMAR
                    </button>
                    <button type="button" onClick={exitConfirm} className="bg-[#3C3D37] w-[173px] h-[58px] rounded-[10px] text-[#ECDFCC] font-bold mt-[10px]">
                        CANCELAR
                    </button>
                </div>
            </form>
            {erroR !== ""?(
                <p className="text-[red] mt-1" >{erroR}</p>
            ):null}
        </div>
    );
}