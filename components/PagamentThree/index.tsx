import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";

import seta from "@/public/images/arrow.png";
import { SelectInput } from "../SelectInput";
import { PagamentCard } from "../PagamentCard";
import { PagamentPix } from "../PagamentPix";
import React from "react";
import { PagamentMoney } from "../PagamentMoney";
import { pagament, useGetPagament } from "@/hooks/useGetPagament";

type threePagament = {
  RegisteredId: number;
  email: string;
  value: number;
  Start: ()=> void;
  End: ()=> void;
}

export const PagamentThree = ({RegisteredId, email, value, Start, End}:threePagament) => {

  const [pagamentOne, setPagamentOne] = useState<pagament>();
  const [pagamentTwo, setPagamentTwo] = useState<pagament>();
  const [valueN, setValueN] = useState<number>(parseFloat((value / 2).toFixed(1)));
  const [valueNTWO, setValueNTWO] = useState<number>(parseFloat((value / 2).toFixed(1)));
  const valueGuard = (parseFloat((value / 2).toFixed(1)));

  // Calcula as datas dos pagamentos subsequentes
  const getNextMonthDate = (baseDate: Date, monthsToAdd: number) => {
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + monthsToAdd); 
    return newDate;
  };

  // Data atual
  const [dateNow, setDateNow] = useState<Date>(new Date());
  const [dateNowTwo, setDateNowTwo] = useState<Date>(getNextMonthDate(new Date(), 1));

  // PagamentOne
  const [displayOne, setDisplayOne] = useState(false);
  const [formatPag, setFormPag] = useState("Pix");

  const handleFormaPag = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormPag(e.currentTarget.value);
  };

  // PagamentTwo
  const [displayTwo, setDisplayTwo] = useState(false);
  const [formatPagTwo, setFormPagTwo] = useState("Pix");

  const handleFormaPagTwo = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormPagTwo(e.currentTarget.value);
  };


  //hooks
  const {authenticationGetPagament} = useGetPagament();


  //useEffect
  useEffect(()=>{
    if(formatPag === "Cartão de crédito"){
      setValueN((0.0531*valueGuard)+valueGuard);
    }else{
      setValueN(valueGuard);
    }
  },[formatPag])

  useEffect(()=>{
    if(formatPagTwo === "Cartão de crédito"){
      setValueNTWO((0.0531*valueGuard)+valueGuard);
    }else{
      setValueNTWO(valueGuard);
    }
  },[formatPagTwo])


  useEffect(()=>{
    const element = authenticationGetPagament();
    element.then(res=>{
      if(typeof res !== "string" && res.length !== 0){
        const listRes = res.filter(val=> val.registeredId === RegisteredId);

        if(listRes && listRes.length !== 0){
          listRes.map(v=>{
            if(v.numbPayment === 1){
              setPagamentOne(v);
              setDateNow(v.createdAt);
              setDateNowTwo(getNextMonthDate(v.createdAt, 1));
            }else if(v.numbPayment === 2){
              setPagamentTwo(v);
            }
          });
        }else{
          setDateNow(new Date());
          setDateNowTwo(getNextMonthDate(new Date(), 1))
        }
      }
    });
  },[]);

  return (
    <main className="flex flex-col" >
      {pagamentOne?(
        <div className="text-[#3C3D37] text-center mt-10 md:w-auto w-[90%] self-center" >
          <h2 className="text-[20px] md:text-[25px] font-bold  md:mb-0 mb-2" >Você já efetuou o primeiro pagamento via {pagamentOne.method}</h2>
          <p className="md:text-[18px] text-4 font-semibold" >Valor pago: <span className="md:text-[18px] text-4 font-bold text-[#ECDFCC]" >{pagamentOne.quantity} reais</span></p>
          <p className="md:text-[18px] text-4 font-semibold" >Situação: <span className="md:text-[18px] text-4 font-bold text-[#ECDFCC]" >{pagamentOne.isPaid?"Está pago":"Não pago"}</span></p>
          <p className="md:text-[18px] text-4 font-semibold" >Resposta do sistema: <span className="md:text-[18px] text-4 font-bold text-[#ECDFCC]" >{pagamentOne.resAdmin}</span></p>
        </div>
      ):(
        <section className="md:w-auto w-[90%] self-center mt-10 bg-[#3C3D37] flex flex-col items-center gap-4 p-2 rounded-[10px]">
            <div className="flex items-center gap-4">
              <h2 className="text-[16px] md:text-[20px] text-[#ECDFCC]">
                Primeiro pagamento no(a){" "}
                {dateNow.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <Image
                src={seta}
                alt="icTwo"
                className="cursor-pointer"
                onClick={() => {
                  setDisplayOne(!displayOne);
                }}
                width={20}
                height={20}
              />
            </div>
            <div
              className="mt-2 flex-col"
              style={{ display: displayOne ? "flex" : "none" }}
            >
              <p className="text-[#ECDFCC] mb-2" >Valor: {valueN} R$</p>
              <p className="text-[#ECDFCC]">Formato de pagamento:</p>
              <SelectInput
                name={formatPag}
                value={formatPag}
                id="1"
                required
                onchange={handleFormaPag}
                options={["Cartão de crédito", "Pix", "Dinheiro físico"]}
                placeholder=""
                erro
              />
              {formatPag === "Cartão de crédito" ? (
                <PagamentCard End={End} Start={Start} email={email} idRegistered={RegisteredId} number={1} value={valueN} twoMethod="Duas vezes"/>
              ) : (

                <React.Fragment>
                    {formatPag === "Pix"?(
                      <PagamentPix End={End} Start={Start} idRegistered={RegisteredId} number={1} value={valueN} twoMethod="Duas vezes"/>
                    ):(
                      <PagamentMoney End={End} Start={Start} RegisteredId={RegisteredId} number={1} value={valueN} twoMethod="Duas vezes"/>
                    )}
                </React.Fragment>
              )}
            </div>
        </section>
      )}

      {/* Two */}

      {pagamentTwo?(
        <div className="text-[#3C3D37] text-center mt-10 md:w-auto w-[90%] self-center" >
        <h2 className="text-[20px] md:text-[25px] font-bold  md:mb-0 mb-2" >Você já efetuou o primeiro pagamento via {pagamentTwo.method}</h2>
        <p className="md:text-[18px] text-4 font-semibold" >Valor pago: <span className="md:text-[18px] text-4 font-bold text-[#ECDFCC]" >{pagamentTwo.quantity} reais</span></p>
        <p className="md:text-[18px] text-4 font-semibold" >Situação: <span className="md:text-[18px] text-4 font-bold text-[#ECDFCC]" >{pagamentTwo.isPaid?"Está pago":"Não pago"}</span></p>
        <p className="md:text-[18px] text-4 font-semibold" >Resposta do sistema: <span className="md:text-[18px] text-4 font-bold text-[#ECDFCC]" >{pagamentTwo.resAdmin}</span></p>
      </div>
      ):(
        <section className="md:w-auto w-[90%] self-center mt-10 bg-[#3C3D37] flex flex-col items-center gap-4 p-2 rounded-[10px] mb-5">
            <div className="flex items-center gap-4">
              <h2 className="text-[16px] md:text-[20px] text-[#ECDFCC]">
                Segundo pagamento no(a){" "}
                {dateNowTwo.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <Image
                src={seta}
                alt="icTwo"
                className="cursor-pointer"
                onClick={() => {
                  setDisplayTwo(!displayTwo);
                }}
                width={20}
                height={20}
              />
            </div>
            <div
              className="mt-2 flex-col"
              style={{ display: displayTwo ? "flex" : "none" }}
            >
              <p className="text-[#ECDFCC] mb-2" >Valor: {valueNTWO} R$</p>
              <p className="text-[#ECDFCC]">Formato de pagamento:</p>
              <SelectInput
                name={formatPagTwo}
                value={formatPagTwo}
                id="1"
                required
                onchange={handleFormaPagTwo}
                options={["Cartão de crédito", "Pix", "Dinheiro físico"]}
                placeholder=""
                erro
              />
              {formatPagTwo === "Cartão de crédito" ? (
                <PagamentCard End={End} Start={Start} email={email} idRegistered={RegisteredId} number={2} value={valueNTWO} twoMethod="Duas vezes"/>
              ) : (

                <React.Fragment>
                    {formatPagTwo === "Pix"?(
                      <PagamentPix End={End} Start={Start} idRegistered={RegisteredId} number={2} value={valueNTWO} twoMethod="Duas vezes"/>
                    ):(
                      <PagamentMoney End={End} Start={Start} RegisteredId={RegisteredId} number={2} value={valueNTWO} twoMethod="Duas vezes"/>
                    )}
                </React.Fragment>
              )}
            </div>
        </section>
      )}
      
    </main>
  );
};

