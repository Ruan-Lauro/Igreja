"use client"
import Image from "next/image";
import logoimg from "@/public/images/cor 2.png";
import logo from "@/public/images/logo.png";
import home from "@/public/images/home.png";
import perfil from "@/public/images/user.png";
import event from "@/public/images/event.png";
import pagament from "@/public/images/pagament.png";
import admin from "@/public/images/admin.png";
import menu from "@/public/images/menu.png";
import Link from "next/link";
import { useState } from "react";
import { redirect } from "next/navigation";
import { removeCookie } from "@/lib/cookie";

type menu = {
    value: string;
    isAdmin?: boolean;
}

export const Menu = ({value, isAdmin}:menu) =>{

    const [menuL, setMenuL] = useState(false);

    return(
        <div className="w-full md:w-auto md:h-[100%] bg-[#3C3D37] text-[#ECDFCC] flex flex-col items-center fixed z-[1000]" style={menuL?{height:"100%"}:{}} >
          <div className="md:flex flex-col hidden w-43 h-[100%]" >
            <Image
                    src={logoimg}
                    alt="Logo"
                    style={{ objectFit: "contain", marginBottom:"50px", marginTop:"20px" }}
                    width={130}
                    height={130}
                />
                <div className="flex flex-col items-center h-[415px] justify-between" style={isAdmin?{height:"415px"}:{height:"370px"}} >
                        <Link href="Home">
                            {value == "1"?(
                                <div className="flex flex-col items-center gap-2 w-[45px] h-[45px]" >
                                <Image
                                    src={home}
                                    alt="icone"
                                    width={45}
                                    height={45}
                                />
                                <p className="text-[16px] font-bold" >Home</p>
                            </div>
                            ):(
                                <div className="flex flex-col items-center gap-2 w-[45px] h-[45px]" >
                                <Image
                                    src={home}
                                    alt="icone"
                                    className="hover:w-[45px] hover:h-[45px]"
                                    width={35}
                                    height={35}
                                />
                                <p className="text-[16px] font-bold" >Home</p>
                            </div>
                            )}
                        </Link>
                        <Link href="Perfil">
                            {value == "2"?(
                                <div className="flex flex-col items-center gap-2 w-[45px] h-[45px]" >
                                <Image
                                    src={perfil}
                                    alt="icone"
                                    width={45}
                                    height={45}
                                />
                                <p className="text-[16px] font-bold" >Perfil</p>
                            </div>
                            ):(
                                <div className="flex flex-col items-center gap-2 w-[45px] h-[45px]" >
                                <Image
                                    src={perfil}
                                    alt="icone"
                                    className="hover:w-[40px] hover:h-[45px]"
                                    width={35}
                                    height={35}
                                />
                                <p className="text-[16px] font-bold" >Perfil</p>
                            </div>
                            )}
                        </Link>
                        <Link href="Pagament">
                            {value == "3"?(
                                <div className="flex flex-col items-center gap-2 w-[45px] h-[45px]" >
                                <Image
                                    src={pagament}
                                    alt="icone"
                                    width={45}
                                    height={45}
                                />
                                <p className="text-[16px] font-bold" >Pagar</p>
                            </div>
                            ):(
                                <div className="flex flex-col items-center gap-2 w-[45px] h-[45px]" >
                                <Image
                                    src={pagament}
                                    alt="icone"
                                    className="hover:w-[45px] hover:h-[45px]"
                                    width={35}
                                    height={35}
                                />
                                <p className="text-[16px] font-bold" >Pagar</p>
                            </div>
                            )}
                        </Link>
                        {isAdmin?(
                            <Link href="InforUsers">
                                {value == "5"?(
                                    <div className="flex flex-col items-center gap-2 w-[45px] h-[45px]" >
                                    <Image
                                        src={admin}
                                        alt="icone"
                                        width={45}
                                        height={45}
                                    />
                                    <p className="text-[16px] font-bold" >Admin</p>
                                </div>
                                ):(
                                    <div className="flex flex-col items-center gap-2 w-[45px] h-[45px]" >
                                    <Image
                                        src={admin}
                                        alt="icone"
                                        className="hover:w-[45px] hover:h-[45px]"
                                        width={35}
                                        height={35}
                                    />
                                    <p className="text-[16px] font-bold" >Admin</p>
                                </div>
                                )}
                            </Link>
                        ):null}
                        <Link href="Register">
                                {value == "4"?(
                                    <div className="flex flex-col items-center gap-2 w-[45px] h-[45px]" >
                                    <Image
                                        src={event}
                                        alt="icone"
                                        width={40}
                                        height={40}
                                    />
                                    <p className="text-[16px] font-bold" >Evento</p>
                                </div>
                                ):(
                                    <div className="flex flex-col items-center gap-2 w-[45px] h-[45px]" >
                                    <Image
                                        src={event}
                                        alt="icone"
                                        className="hover:w-[45px] hover:h-[45px]"
                                        width={35}
                                        height={35}
                                    />
                                    <p className="text-[16px] font-bold" >Evento</p>
                                </div>
                                )}
                        </Link>
                </div>
          </div>
          <div className="md:hidden w-full flex items-center justify-between pl-2 pr-2" style={menuL?{display:"none"}:{}}>
            <Link href="Home">
                <Image
                    src={logo}
                    alt="Logo"
                    style={{ objectFit: "contain", marginBottom:"10px", marginTop:"10px", }}
                    width={50}
                    height={50}
                />
            </Link>
            <Image
                src={menu}
                alt="Logo"
                style={{ objectFit: "contain", marginBottom:"10px", marginTop:"10px", marginLeft: "10px" }}
                width={35}
                height={35}
                onClick={()=>{
                    setMenuL(true);
                }}
            />
          </div>
          <div className="w-full flex-col ml-10 mt-10 gap-5" style={menuL?{display:"flex"}:{display:"none"}} >
                <Link href="Home" >
                    <p className="text-[18px]" >Home</p>
                </Link>
                <Link href="Perfil" >
                    <p className="text-[18px]" >Perfil</p>
                </Link>
                <Link href="Pagament" >
                    <p className="text-[18px]" >Pagar</p>
                </Link>
                <Link href="Register" >
                    <p className="text-[18px]" >Evento</p>
                </Link>
                {isAdmin?(
                    <Link href="InforUsers" >
                        <p className="text-[18px]" >Admin</p>
                    </Link>
                ):null}
                <p className="text-[18px] cursor-pointer" onClick={()=>{
                        removeCookie("users");
                        redirect("/"); 
                    }} >Sair</p>
                <p className="text-[18px] cursor-pointer" onClick={()=>{
                    setMenuL(false);
                }} >Fechar</p>
          </div>
        </div>
    );
}