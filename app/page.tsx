"use client"
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import logoimg from "@/public/images/cor 2.png";
import { AuthInput } from "@/components/input";
import {useLogin} from "@/hooks/useLogin";
// import { EmailConfirm } from "@/components/EmailConfirm";
import { usePostUsers } from "@/hooks/usePostUsers";
import { redirect } from 'next/navigation'
import { Loading } from "@/components/Loading";

import { setCookie } from "@/lib/cookie";
import { useGetUsers } from "@/hooks/useGetUsers";

export default function Home() {

  //type form
  const [trueLogin, setTrueLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  //Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Registed
  const [name, setName] = useState('');
  const [emailR, setEmailR] = useState('');
  const [passwordR, setPasswordR] = useState('');
  const [confirmPasswordR, setConfirmPasswordR] = useState('');

  //confirm E-mail
  // const[trueConfirmEmail, setTrueConfirmEmail] = useState(false);

  //hooks
  const {authenticationLogin} = useLogin();
  const {authenticationAddUsers} = usePostUsers();
  const {authenticationUsers} = useGetUsers();

  //Erro of the login and register
  const [erro, setErro] = useState("");
  const [erroR, setErroR] = useState("");

  //Login inputs
  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  //Register inputs
  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleEmailR = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailR(e.currentTarget.value);
  };

  const handlePasswordR = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordR(e.currentTarget.value);
  };

  const handleConfirmPasswordR = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPasswordR(e.currentTarget.value);
  };

  //Push Form
  const handleForm = (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    setLoading(true);
    if(trueLogin){
      const loginRes = {
        email,
        password
      }; 
      const resultLogin = authenticationLogin(loginRes);
      resultLogin.then(value=>{
        console.log(value)
        if(typeof value == "string"){
          setErro(value);
          setLoading(false)
        }else{
          setErro("")
          setCookie("users", value);
          setLoading(false)
          redirect(`/Register/`)
        }
      })
    }else{
      if(passwordR !== confirmPasswordR){
        setErroR("Senhas estão diferentes")
        setLoading(false)
        return
      }
      if(passwordR.length !== 8){
        setErroR("Senha não contém 8 digitos")
        setLoading(false)
        return
      }
      setLoading(false)
      // setTrueConfirmEmail(true);
      handleConfirmEmail();
    }
  }

  //true Confirm E-mail
  const handleConfirmEmail = () =>{
    setLoading(true);
    // setTrueConfirmEmail(false)
    const userRegister = {
      name,
      email: emailR,
      password: passwordR,
      isAdmin: false,
    }
    const res = authenticationAddUsers(userRegister);
    res.then(value=>{
      if(value === "User created!"){
        const loginRes = {
          email: emailR,
          password: passwordR,
        }; 
        const resultLogin = authenticationLogin(loginRes);
        resultLogin.then(value=>{
          if(typeof value == "string"){
            setErro(value);
            setLoading(false);
          }else{
            setErro("")
            setCookie("users", value);
            setLoading(false);
            redirect(`/Register/`)
          }
        })
      }else{
        setErroR(value)
      }
    })
  }

  //Initiate the request

  const getUsers = async () =>{
    const element = await authenticationUsers();
    return element;
  }

  useEffect(() => {
    const fetchUsers = () => {
      getUsers(); 
    };
  
    fetchUsers();
  }, []);


  return (
    <div className="bg-[#3C3D37] w-full h-[100vh] flex items-center justify-center gap-[20px] relative" >

      {loading?(
        <Loading/>
      ):null}

      {/* {trueConfirmEmail?(
        <div className="z-10 w-full h-full absolute flex justify-center items-center bg-black/50" >
        <EmailConfirm exitConfirm={()=>{
          setTrueConfirmEmail(false); 
        }} email={emailR} autheConfirm={handleConfirmEmail} />
        </div>
      ):null} */}

      {trueLogin?(
        <React.Fragment>
            <div className="hidden xl:flex flex-col w-[638px] h-[543px] bg-[#697565] text-[#ECDFCC] rounded-[25px] items-center" >
            <Image
                src={logoimg}
                alt="Logo"
                className="img_darken"
                style={{ objectFit: "contain", marginBottom:"40px", marginTop:"10px" }}
                width={202}
                height={202}
              />
            <p className="text-[18px] w-[50%] text-center mb-[20px]" >Faça o login da sua conta, assim você terá acesso a sua conta e verá sua inscrição para o acampamento 2025. </p>
            <p className="text-[18px] w-[50%] text-center mb-[40px]" >Não tem conta? Então faça o cadastro! </p>
            <button className="bg-[#ECDFCC] w-[173px] h-[58px] rounded-[10px] text-[#697565] font-bold" onClick={()=>{
              setTrueLogin(false)
            }}>
              CADASTRO
            </button>
          </div>
          <div className="flex flex-col w-full h-full md:w-[638px] md:h-[543px] bg-[#ECDFCC]  md:rounded-[25px] items-center" >
            <h2 className="text-[48px] text-[#3C3D37] font-bold mt-[80px] mb-[60px]" >Login</h2>
            <form action="" className="w-[70%] flex flex-col items-center gap-[45px]" onSubmit={handleForm}>
                <AuthInput erro={erro == ""? false: true} name={email} onchange={handleEmail} placeholder="E-mail" type="text" value={email} id="1" required />
                <div className="w-full" >
                  <AuthInput erro={erro == ""? false: true} name={password} onchange={handlePassword} placeholder="Senha" type="password" value={password} id="2" required />
                  {/* <Link href={""} >
                    <p className="text-[#3C3D37]/80 mt-[10px] hover:underline" >Esqueceu a senha?</p>
                  </Link> */}
                </div>
                <button className="bg-[#3C3D37] w-[173px] h-[58px] rounded-[10px] text-[#ECDFCC] font-bold mt-[35px]">
                  LOGIN
                </button>
                <p className="text-[#3C3D37]/80 mt-[-30px] xl:hidden" onClick={()=>{
                  setTrueLogin(false);
                }} >Fazer cadastro</p>
            </form>
            {erro !== ""?(
              <p className="text-[red] mt-4" >{erro}</p>
            ):null}
          </div>
        </React.Fragment>
      ):(
        <React.Fragment>
          <div className="flex flex-col w-full h-full md:w-[638px] md:h-[543px] bg-[#ECDFCC]  md:rounded-[25px] items-center" >
            <h2 className="text-[48px] text-[#3C3D37] font-bold mt-[70px] mb-[40px]" >Cadastro</h2>
            <form onSubmit={handleForm} className="w-[70%] flex flex-col items-center gap-[35px]">
                <AuthInput erro={erroR == ""? false: true} name={name} onchange={handleName} placeholder="Nome" type="text" value={name} id="1" required />
                <AuthInput erro={erroR == ""? false: true} name={emailR} onchange={handleEmailR} placeholder="E-mail" type="text" value={emailR} id="2" required />
                <AuthInput erro={erroR == ""? false: true} name={passwordR} onchange={handlePasswordR} placeholder="Senha" type="password" value={passwordR} id="3" required />
                <AuthInput erro={erroR == ""? false: true} name={confirmPasswordR} onchange={handleConfirmPasswordR} placeholder="Confirmar Senha" type="password" value={confirmPasswordR} id="4" required />
                <p className="text-[#3C3D37] mt-[-20px] self-start" >A senha deve conter oito digitos</p>
                <button className="bg-[#3C3D37] w-[173px] h-[58px] rounded-[10px] text-[#ECDFCC] font-bold mt-[-15px]">
                  CADASTRO
                </button>
                <p className="text-[#3C3D37]/80 mt-[-30px] xl:hidden" onClick={()=>{
                  setTrueLogin(false);
                }} >Fazer login</p>
            </form>
            {erroR !== ""?(
              <p className="text-[red] mt-1" >{erroR}</p>
            ):null}
          </div>
          <div className="hidden xl:flex flex-col w-[638px] h-[543px] bg-[#697565] text-[#ECDFCC] rounded-[25px] items-center" >
            <Image
                src={logoimg}
                alt="Logo"
                className="img_darken"
                style={{ objectFit: "contain", marginBottom:"40px", marginTop:"10px" }}
                width={202}
                height={202}
              />
            <p className="text-[18px] w-[50%] text-center mb-[20px]" >Faça o cadastro da sua conta, assim você terá acesso a sua conta e verá sua inscrição para o acampamento 2025.</p>
            <p className="text-[18px] w-[50%] text-center mb-[40px]" >Já tem conta? Então faça o login!</p>
            <button className="bg-[#ECDFCC] w-[173px] h-[58px] rounded-[10px] text-[#697565] font-bold" onClick={()=>{
              setTrueLogin(true)
            }}>
              LOGIN
            </button>
          </div>
        
        </React.Fragment>
      )}
    </div>
  );
}
