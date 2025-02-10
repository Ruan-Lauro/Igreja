    "use client"

    import { pagament } from "@/hooks/useGetPagament";
    import { registered } from "@/hooks/useGetRegistered";
    import { users } from "@/hooks/useGetUsers";
    import Image from "next/image";
    import seta from "@/public/images/arrow.png";
    import "./style.scss";
    import perfil from "@/public/images/pers.png";
    import React, { useState } from "react";
    import { useDeletePagament } from "@/hooks/useDeletePagament";
    import { putPagament, usePutPagament } from "@/hooks/usePutPagament";
    import pdf from '@/public/images/pdf.png';
import Link from "next/link";

    export type AuthInfor = {
        user:users;
        registered:registered;
        pagament:pagament[];
        update: ()=>void;
    };

    export const Infor = ({
    user,
    registered,
    pagament,
    update

    }: AuthInfor) => {

        const [display, setDisplay] = useState(false);
        const {authenticationDeletePagament} = useDeletePagament();
        const {authenticationPutPagament} = usePutPagament();
        let pagamentValue = "";
        if (pagament[0]) {
            if (pagament[0]?.twoMethod === "Duas vezes") {
                if (pagament[0]?.isPaid && pagament[1]?.isPaid) {
                    pagamentValue = "Pago";
                } else if (pagament[0]?.resAdmin==="Em análise..." || pagament[1]?.resAdmin==="Em análise...") {
                    pagamentValue = "Não confirmado";
                } else if (pagament[0]?.isPaid || pagament[1]?.isPaid) {
                    pagamentValue = "Falta uma parcela";
                } else {
                    pagamentValue = "Não pago";
                }
            } else {
                if (pagament[0]?.isPaid) {
                    pagamentValue = "Pago";
                } else if (pagament[0]?.resAdmin === "Em análise...") {
                    pagamentValue = "Não confirmado";
                } else {
                    pagamentValue = "Não pago";
                }
            }
        } else {
            pagamentValue = "Não pago";
        }

        const deletePagament = async (id: number) =>{
            await authenticationDeletePagament({id});
            update();
        };

        const editPagament = async (pagamentValue:putPagament) =>{
            await authenticationPutPagament(pagamentValue);
            update();
        }

        return (
        <div className="inforUser max-w-[450px]" >
            <div className="flex justify-between" >
                <div className="w-[70%] flex mr-2 items-center gap-2" >
                    <Image
                        src={user.imgUser || perfil}
                        alt="perfil"
                        width={100}
                        height={100}
                        style={{borderRadius:"100%", width:"40px", height:"40px", objectFit:"cover"}}
                    /> 
                    <p><span>{user.name}</span></p>
                </div>
                <div className="flex gap-2 items-center">
                    <p><span className="flex text-center" style={pagamentValue==="Pago"?{color:"green"}:pagamentValue==="Não pago"?{color:"#ff0000"}:{color:"orange"}} >{pagamentValue}</span></p>
                    <Image
                        src={seta}
                        alt="icTwo"
                        className="cursor-pointer"
                        onClick={() => {
                        setDisplay(!display);
                        }}
                        width={20}
                        height={10}
                        objectFit="contain"
                        style={display?{transform:"scaleY(-1)", height:"20px"}:{transform:"none", height:"20px"}}
                    />                
                </div>
            </div>
            <div className="flex-col mt-2" style={display?{display:"flex"}:{display:"none"}} >
                {/* Information */}
                <h2 className="text-[18px] font-bold text-[#ecdfccbc] mb-2" >INFORMAÇÕES PESSOAIS</h2>
                <p>E-mail: <span>{user.email}</span></p>
                <p>CPF: <span>{registered.cpf}</span></p>
                <p>Celular: <span>{registered.phoneNumber}</span></p>
                <p>Sexo: <span>{registered.sex}</span></p>
                <p>Aniversário:{" "}
                    <span>
                        {new Date(registered.birthDate).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        })}
                    </span>
                </p>
                <p>Alergia?: <span>{registered.allergy?"Sim":"Não"}</span></p>
                <p>Alergia a: <span>{registered.allergyDetails?registered.allergyDetails:"Nada"}</span></p>
                <p>Toma Medicamento?: <span>{registered.medication?"Sim":"Não"}</span></p>
                <p>O medicamento: <span>{registered.medicationDetails?registered.medicationDetails:"Nenhum"}</span></p>
                <p>Número de emergência: <span>{registered.numberEmergency}</span></p>
                {/* Address */}
                <h2 className="text-[18px] font-bold text-[#ecdfccbc] mb-2 mt-2" >ENDEREÇO</h2>
                <p>CEP: <span><span>{registered.zipCode}</span></span></p>
                <p>Estado: <span><span>{registered.state}</span></span></p>
                <p>Cidade: <span><span>{registered.city}</span></span></p>
                <p>Bairro: <span><span>{registered.neighborhood}</span></span></p>
                <p>Ponto de referência: <span><span>{registered.referencePoint}</span></span></p>
                <p>Número: <span><span>{registered.number}</span></span></p>
                {/* Pagament */}
                <h2 className="text-[18px] font-bold text-[#ecdfccbc] mb-2 mt-2" >PAGAMENTO</h2>
                <p>Plano: <span>{registered.plan}</span></p>
                {pagament[0]?.twoMethod ? (
                <div className="w-full flex flex-col">
                    <h2 className="text-[18px] font-bold text-[#ecdfccbc] mb-2 mt-2">*Primeira</h2>
                    <p>Método: <span>{pagament[0]?.twoMethod}</span></p>
                    <p>Forma: <span>{pagament[0]?.method}</span></p>
                    <p>Valor: <span>{pagament[0]?.amount}</span></p>
                    <p>Quantidade: <span>{pagament[0]?.quantity}</span></p>
                    <p>Situação: <span style={pagament[0].isPaid?{color:"green"}:{color:"#ff0000"}} >{pagament[0].isPaid?"Pago":"Não pago"}</span></p>
                    <p>Data de pagamento: {" "}<span>
                        {new Date(pagament[0].createdAt).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        })}
                    </span></p>
                    {pagament[0]?.method === "Pix" ? (
                        <div className="flex flex-col" >
                            <p>Comprovante:</p>
                                <Image
                                src={pagament[0]?.checking}
                                objectFit="cover"
                                alt="icone"
                                width={300}
                                height={300}
                                style={{alignSelf:"center"}}
                                />
                        </div>
                    ) : null}
                    {pagament[0].resAdmin === "Em análise..."?(
                        <div className="flex gap-3 mt-2 mb-2" >
                            <button
                                type="button"
                                className="w-full bg-[#697565] text-[#ECDFCC] text-[16px] font-semibold py-2 rounded-md hover:bg-[#697565]/50 transition"
                                onClick={()=>{
                                    editPagament({id:pagament[0].id, resAdmin:"Pago", isPaid:true});
                                }}
                                >
                                CONFIRMAR
                            </button>
                            <button
                                type="button"
                                className="w-full bg-[#697565] text-[#ECDFCC] text-[16px] font-semibold py-2 rounded-md hover:bg-[#697565]/50 transition"
                                onClick={()=>{
                                    deletePagament(pagament[0].id)
                                }}
                                >
                                REJEITAR
                            </button>
                        </div>
                    ):null}
                    {pagament[1] && (
                        <>
                            <h2 className="text-[18px] font-bold text-[#ecdfccbc] mb-2 mt-2">*Segunda</h2>
                            <p>Método: <span>{pagament[1]?.twoMethod}</span></p>
                            <p>Forma: <span>{pagament[1]?.method}</span></p>
                            <p>Valor: <span>{pagament[1]?.amount}</span></p>
                            <p>Quantidade: <span>{pagament[1]?.quantity}</span></p>
                            <p>Situação: <span style={pagament[1].isPaid?{color:"green"}:{color:"#ff0000"}} >{pagament[1].isPaid?"Pago":"Não pago"}</span></p>
                            <p>Data de pagamento: {" "}<span>
                                {new Date(pagament[1].createdAt).toLocaleDateString("pt-BR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                })}
                            </span></p>
                            {pagament[1]?.method === "Pix" ? (
                                 <div className="flex flex-col" >
                                 <p>Comprovante:</p>
                                     <Image
                                     src={pagament[1]?.checking}
                                     objectFit="cover"
                                     alt="icone"
                                     width={300}
                                     height={300}
                                     style={{alignSelf:"center"}}
                                 />
                             </div>
                            ) : null}
                            {pagament[1].resAdmin === "Em análise..."?(
                                <div className="flex gap-3 mt-2 mb-2" >
                                    <button
                                        type="button"
                                        className="w-full bg-[#697565] text-[#ECDFCC] text-[16px] font-semibold py-2 rounded-md hover:bg-[#697565]/50 transition"
                                        onClick={()=>{
                                            editPagament({id:pagament[1].id, resAdmin:"Pago", isPaid:true});
                                        }}
                                        >
                                        CONFIRMAR
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full bg-[#697565] text-[#ECDFCC] text-[16px] font-semibold py-2 rounded-md hover:bg-[#697565]/50 transition"
                                        onClick={()=>{
                                            deletePagament(pagament[1].id)
                                        }}
                                        >
                                        REJEITAR
                                    </button>
                                </div>
                            ):null}
                        </>
                    )}
                </div>
            ) : (
                <div>
                    {pagament[0] && (
                        <>
                            <p>Forma: <span>{pagament[0]?.method}</span></p>
                            <p>Valor: <span>{pagament[0]?.amount}</span></p>
                            <p>Quantidade: <span>{pagament[0]?.quantity}</span></p>
                            <p>Situação: <span style={pagament[0].isPaid?{color:"green"}:{color:"#ff0000"}} >{pagament[0].isPaid?"Pago":"Não pago"}</span></p>
                            <p>Data de pagamento: {" "}<span>
                                {new Date(pagament[0].createdAt).toLocaleDateString("pt-BR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                })}
                            </span></p>
                            {pagament[0]?.method === "Pix" ? (
                                <div className="flex flex-col" >
                                <p>Comprovante:</p>
                                    
                                    {pagament[0].checking.includes('pdf')?(
                                        <Link href={pagament[0].checking}>
                                            <Image
                                                src={pdf}
                                                objectFit="cover"
                                                alt="icone"
                                                width={100}
                                                height={100}
                                                style={{alignSelf:"center"}}
                                            />
                                        </Link>
                                    ):(
                                        <Image
                                        src={pagament[0]?.checking}
                                        objectFit="cover"
                                        alt="icone"
                                        width={300}
                                        height={300}
                                        style={{alignSelf:"center"}}
                                        />
                                    )}
                                    
                            </div>
                            ) : null}
                            {pagament[0].resAdmin === "Em análise..."?(
                        <div className="flex gap-3 mt-2 mb-2" >
                            <button
                                type="button"
                                className="w-full bg-[#697565] text-[#ECDFCC] text-[16px] font-semibold py-2 rounded-md hover:bg-[#697565]/50 transition"
                                onClick={()=>{
                                    editPagament({id:pagament[0].id, resAdmin:"Pago", isPaid:true});
                                }}
                                >
                                CONFIRMAR
                            </button>
                            <button
                                type="button"
                                className="w-full bg-[#697565] text-[#ECDFCC] text-[16px] font-semibold py-2 rounded-md hover:bg-[#697565]/50 transition"
                                onClick={()=>{
                                    deletePagament(pagament[0].id)
                                }}
                                >
                                REJEITAR
                            </button>
                        </div>
                    ):null}
                        </>
                    )}
                </div>
            )}
            </div>
        </div>
        );
    };