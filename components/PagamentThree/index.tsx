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

  const valueN = Math.floor(value/3);

  const [pagamentOne, setPagamentOne] = useState<pagament>();
  const [pagamentTwo, setPagamentTwo] = useState<pagament>();
  const [pagamentThree, setPagamentThree] = useState<pagament>();

  // Data atual
  const [dateNow, setDateNow] = useState<Date>(new Date());

  // Calcula as datas dos pagamentos subsequentes
  const getNextMonthDate = (baseDate: Date, monthsToAdd: number) => {
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + monthsToAdd); 
    return newDate;
  };

  const secondPaymentDate = getNextMonthDate(dateNow, 1); 
  const thirdPaymentDate = getNextMonthDate(dateNow, 2); 

  // PagamentOne
  const [displayOne, setDisplayOne] = useState(false);
  const [formatPag, setFormPag] = useState("Cartão de crédito");

  const handleFormaPag = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormPag(e.currentTarget.value);
  };

  // PagamentTwo
  const [displayTwo, setDisplayTwo] = useState(false);
  const [formatPagTwo, setFormPagTwo] = useState("Cartão de crédito");

  const handleFormaPagTwo = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormPagTwo(e.currentTarget.value);
  };

  // PagamentThree
  const [displayThree, setDisplayThree] = useState(false);
  const [formatPagThree, setFormPagThree] = useState("Cartão de crédito");

  //hooks
  const {authenticationGetPagament} = useGetPagament();

  const handleFormaPagThree = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormPagThree(e.currentTarget.value);
  };

  useEffect(()=>{
    const element = authenticationGetPagament();
    element.then(res=>{
      if(typeof res !== "string" && res.length !== 0){
        const listRes = res.filter(val=> val.registeredId === RegisteredId);

        if(listRes && listRes.length !== 0){
          listRes.map(v=>{
            if(v.numbPayment === 1){
              setPagamentOne(v);
            }else if(v.numbPayment === 2){
              setPagamentTwo(v);
            }else{
              setPagamentThree(v);
            }
          });
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
                <PagamentCard End={End} Start={Start} email={email} idRegistered={RegisteredId} number={1} value={valueN} twoMethod="Três vezes"/>
              ) : (

                <React.Fragment>
                    {formatPag === "Pix"?(
                      <PagamentPix End={End} Start={Start} idRegistered={RegisteredId} number={1} value={valueN} twoMethod="Três vezes"/>
                    ):(
                      <PagamentMoney End={End} Start={Start} RegisteredId={RegisteredId} number={1} value={valueN} twoMethod="Três vezes"/>
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
        <section className="md:w-auto w-[90%] self-center mt-10 bg-[#3C3D37] flex flex-col items-center gap-4 p-2 rounded-[10px]">
            <div className="flex items-center gap-4">
              <h2 className="text-[16px] md:text-[20px] text-[#ECDFCC]">
                Segundo pagamento no(a){" "}
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
                <PagamentCard End={End} Start={Start} email={email} idRegistered={RegisteredId} number={2} value={valueN} twoMethod="Três vezes"/>
              ) : (

                <React.Fragment>
                    {formatPagTwo === "Pix"?(
                      <PagamentPix End={End} Start={Start} idRegistered={RegisteredId} number={2} value={valueN} twoMethod="Três vezes"/>
                    ):(
                      <PagamentMoney End={End} Start={Start} RegisteredId={RegisteredId} number={2} value={valueN} twoMethod="Três vezes"/>
                    )}
                </React.Fragment>
              )}
            </div>
        </section>
      )}

      {/* Three */}

      {pagamentThree?(
        <div className="text-[#3C3D37] text-center mt-10 md:w-auto w-[90%] self-center" >
        <h2 className="text-[20px] md:text-[25px] font-bold  md:mb-0 mb-2" >Você já efetuou o primeiro pagamento via {pagamentThree.method}</h2>
        <p className="md:text-[18px] text-4 font-semibold" >Valor pago: <span className="md:text-[18px] text-4 font-bold text-[#ECDFCC]" >{pagamentThree.quantity} reais</span></p>
        <p className="md:text-[18px] text-4 font-semibold" >Situação: <span className="md:text-[18px] text-4 font-bold text-[#ECDFCC]" >{pagamentThree.isPaid?"Está pago":"Não pago"}</span></p>
        <p className="md:text-[18px] text-4 font-semibold" >Resposta do sistema: <span className="md:text-[18px] text-4 font-bold text-[#ECDFCC]" >{pagamentThree.resAdmin}</span></p>
      </div>
      ):(
        <section className="md:w-auto w-[90%] self-center mt-10 bg-[#3C3D37] flex flex-col items-center gap-4 p-2 rounded-[10px] mb-5">
            <div className="flex items-center gap-4">
              <h2 className="text-[16px] md:text-[20px]  text-[#ECDFCC]">
                Terceiro pagamento no(a){" "}
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
                  setDisplayThree(!displayThree);
                }}
                width={20}
                height={20}
              />
            </div>
            <div
              className="mt-2 flex-col"
              style={{ display: displayThree ? "flex" : "none" }}
            >
              <p className="text-[#ECDFCC]">Formato de pagamento:</p>
              <SelectInput
                name={formatPagThree}
                value={formatPagThree}
                id="1"
                required
                onchange={handleFormaPagThree}
                options={["Cartão de crédito", "Pix", "Dinheiro físico"]}
                placeholder=""
                erro
              />
              {formatPagThree === "Cartão de crédito" ? (
                <PagamentCard End={End} Start={Start} email={email} idRegistered={RegisteredId} number={3} value={valueN} twoMethod="Três vezes"/>
              ) : (

                <React.Fragment>
                    {formatPagThree === "Pix"?(
                      <PagamentPix End={End} Start={Start} idRegistered={RegisteredId} number={3} value={valueN} twoMethod="Três vezes"/>
                    ):(
                      <PagamentMoney End={End} Start={Start} RegisteredId={RegisteredId} number={3} value={valueN} twoMethod="Três vezes"/>
                    )}
                </React.Fragment>
              )}
            </div>
        </section>
      )}
      
    </main>
  );
};

