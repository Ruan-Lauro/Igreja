"use client"

import { Loading } from "@/components/Loading";
import { Menu } from "@/components/Menu";
import { PagamentCard } from "@/components/PagamentCard";
import { PagamentMoney } from "@/components/PagamentMoney";
import { PagamentPix } from "@/components/PagamentPix";
import { PagamentThree } from "@/components/PagamentThree";
import { SelectInput } from "@/components/SelectInput";
import { pagament, useGetPagament } from "@/hooks/useGetPagament";
import { useGetRegistered } from "@/hooks/useGetRegistered";
import { users } from "@/hooks/useGetUsers";
import { Registered } from "@prisma/client";
import { redirect } from "next/navigation";

import React, { useEffect } from "react";
import { ChangeEvent, useState } from "react";

export default function Pagament (){

    const [formatPag, setFormPag] = useState("Cartão de crédito");
    const [user, setUser] = useState<users>();
    const [registered, setRegistered] = useState<Registered>();
    const [pagament, setPagament] = useState<pagament>();
    const [valueP, setValueP] = useState<number>();
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(false);

    //Hooks
    const {authenticationGetPagament} = useGetPagament();
    const {authenticationRegistered} = useGetRegistered();

    const handleFormaPag = (e: ChangeEvent<HTMLSelectElement>) => {
        setFormPag(e.currentTarget.value);
    };

    useEffect(() => {
      setUpdate(!update);
    }, []);

    useEffect(() => {
        const element = localStorage.getItem('meuDado');
        setLoading(true);
    
        if (element) {
            try {
                const parsedUser = JSON.parse(element);
                if (parsedUser && typeof parsedUser === "object") {
                    setUser(parsedUser); 
                    const listRegis = authenticationRegistered();
                    listRegis.then(val=>{
                        const listNew = val.filter(on=> on.userId === parsedUser.id);
                        if(typeof listNew[0] === "object"){
                            setRegistered(listNew[0]);
                            switch (listNew[0].plan){
                                case "Normal":
                                    setValueP(160);
                                break;
                                case "Maternal":
                                    setValueP(2);
                                break;
                                case "Infantil":
                                    setValueP(80);
                                break;
                                case "Distante":
                                    setValueP(120);
                                break;
                                case "Diaria":
                                    setValueP(35);
                                break;
                                default:
                                    break;
                            }

                            const listPag = authenticationGetPagament();
                            listPag.then(res=>{
                                if(typeof res !== "string"){
                                    const listPagNew = res.filter(li=>li.registeredId===listNew[0].id);
                                    if(listPagNew && listNew.length !== 0){
                                        setPagament(listPagNew[0]);
                                        setLoading(false);
                                    }
                                }else{
                                    setLoading(false);
                                }
                            })
                        }else{
                            setLoading(false);
                            redirect('/Register');
                        }
                    });
                }else{
                    redirect("/");
                }
            } catch (error) {
                console.error("Erro ao parsear o JSON:", error);
            }
        }
    }, [update]);

    return(
        <main className="bg-[#697565] w-full h-[100vh] flex relative" >
             {loading?(
                <Loading/>
             ):null}
             <Menu value="3" />
             <div className="w-full flex flex-col overflow-y-auto items-center md:ml-40" >
                <div className="w-[90%] flex flex-col mt-20 md:mt-0 text-[#ECDFCC] md:w-auto" >
                    <h2 className="mt-5 text-[30px] md:text-[40px] font-bold" >Formato de pagamento</h2>
                    <p className="text-[20px] md:text-[20px]" >Agora escolha a forma que vai pagar sua inscrição!</p>
                    <p className="text-[20px] md:text-[25px] text-center mt-5" > Valor: <span className="font-bold" >{valueP} reais</span></p>
                </div>
                {pagament?(
                    <React.Fragment>
                        {!pagament.twoMethod && pagament.twoMethod !== "Três vezes"?(
                            <div className="text-[#3C3D37] text-center mt-10 flex flex-col" >
                                <h2 className="text-[25px] font-bold" >Você já efetuou o pagamento via {pagament.method}</h2>
                                <p className="text-[18px] font-semibold" >Situação: <span className="text-[18px] font-bold text-[#ECDFCC]" >{pagament.isPaid?"Está pago":"Não pago"}</span></p>
                                <p className="text-[18px] font-semibold text-center" >Resposta do sistema: <span className="text-[18px] font-bold text-[#ECDFCC]" >{pagament.resAdmin}</span></p>
                                
                            </div>
                        ):(
                            <PagamentThree Start={()=>{
                                setLoading(true);
                            }} End={()=>{
                                setLoading(false);
                                setUpdate(!update);
                            }} RegisteredId={registered?.id!} email={user?.email!} value={valueP!}/>
                        )}
                    </React.Fragment>
                ):(
                    <React.Fragment>
                        <div className="max-w-md mt-10" >
                            <SelectInput name={formatPag} value={formatPag} id="1" required onchange={handleFormaPag} options={["Cartão de crédito", "Pix", "Três vezes, parcelado com a igreja", "Dinheiro em mãos"]} placeholder="" erro />
                        </div>
                        {formatPag === "Cartão de crédito"?(
                            <div className="w-[90%] md:w-auto" >
                                <PagamentCard Start={()=>{
                                setLoading(true);
                                }} End={()=>{
                                    setLoading(false);
                                    setUpdate(!update);
                                }} value={valueP!} idRegistered={registered?.id!} email={user?.email!} number={1}/>
                            </div>
                        ):(
                            <React.Fragment>
                                {formatPag === "Pix"?(
                                    <div className="w-[90%] md:w-auto">
                                        <PagamentPix Start={()=>{
                                        setLoading(true);
                                        }} End={()=>{
                                            setLoading(false);
                                            setUpdate(!update);
                                        }} idRegistered={registered?.id!} value={valueP!} number={1}/>
                                    </div>
                                ):( 
                                    <React.Fragment>
                                        {formatPag === "Três vezes, parcelado com a igreja"?(
                                            <PagamentThree Start={()=>{
                                                setLoading(true);
                                            }} End={()=>{
                                                setLoading(false);
                                                setUpdate(!update);
                                            }} RegisteredId={registered?.id!} email={user?.email!} value={valueP!}/>
                                        ):(
                                            <div className="w-[90%] md:w-auto" >
                                                <PagamentMoney Start={()=>{
                                                setLoading(true);
                                                }} End={()=>{
                                                    setLoading(false);
                                                    setUpdate(!update);
                                                }} RegisteredId={registered?.id!} number={1} value={valueP!}/>
                                            </div>
                                        )}
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
             </div>
        </main>
    );
}