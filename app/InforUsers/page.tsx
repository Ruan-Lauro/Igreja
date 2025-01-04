"use client"

import { Menu } from "@/components/Menu";
import { useGetUsers, users } from "@/hooks/useGetUsers";
import { getCookie } from "@/lib/cookie";
import { redirect } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import lupa from "@/public/images/lupa.png";
import Image from "next/image";
import { AuthInfor, Infor } from "@/components/Infor";
import { useGetRegistered } from "@/hooks/useGetRegistered";
import { useGetPagament } from "@/hooks/useGetPagament";
import React from "react";
import { Loading } from "@/components/Loading";

export default function InforUsers() {
    const [user, setUser] = useState<users>();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [list, setList] = useState<AuthInfor[]>([]);
    const [update, setUpdate] = useState(false);

    const { authenticationUsers } = useGetUsers();
    const { authenticationRegistered } = useGetRegistered();
    const { authenticationGetPagament } = useGetPagament();

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    useEffect(() => {
        const initializeUser = async () => {
            const element = getCookie("users");
            if (element) {
                try {
                    const parsedUser = element;
                    if (parsedUser && typeof parsedUser === "object") {
                        setUser(parsedUser);
                        setUpdate(!update);
                        if (!parsedUser.isAdmin) {
                            redirect("/Home/");
                        }
                    }
                } catch (error) {
                    console.error("Erro ao parsear o JSON:", error);
                }
            }
        };
        initializeUser();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if(search === ""){
                try {
                    const users = await authenticationUsers();
                    const registered = await authenticationRegistered();
                    const pagament = await authenticationGetPagament();
    
                    const listNew: AuthInfor[] = users.map((user) => {
                        const regis = registered.find((r) => r.userId === user.id);
                        if (regis) {
                            const paga = pagament.filter((p) => p.registeredId === regis.id);
                            return { user, registered: regis, pagament: paga };
                        }
                        return null;
                    }).filter((item) => item !== null) as AuthInfor[];
    
                    setList(listNew);
                } catch (error) {
                    console.error("Erro ao carregar dados:", error);
                } finally {
                    setLoading(false);
                }
            }else{
                try {
                    const userV = await authenticationUsers();
                    const users = userV.filter(fil=>fil.name.includes(search));
                    const registered = await authenticationRegistered();
                    const pagament = await authenticationGetPagament();
    
                    const listNew: AuthInfor[] = users.map((user) => {
                        const regis = registered.find((r) => r.userId === user.id);
                        if (regis) {
                            const paga = pagament.filter((p) => p.registeredId === regis.id);
                            return { user, registered: regis, pagament: paga };
                        }
                        return null;
                    }).filter((item) => item !== null) as AuthInfor[];
    
                    setList(listNew);
                } catch (error) {
                    console.error("Erro ao carregar dados:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [update, search]);

    return (
        <main className="bg-[#697565] w-full min-h-[100vh] flex relative">
            {loading?(
            <Loading/>
          ):null}
            <Menu value="5" isAdmin={user?.isAdmin || false} />
            <div className="mt-20 mb-4 w-[90%] m-auto sm:w-full flex flex-col overflow-y-auto items-center text-[#ECDFCC] md:ml-[130px]">
                <h1 className="text-[30px] md:text-[40px] mb-4">Análise de inscrição</h1>
                <div className="flex rounded-[5px] p-2 bg-[#3C3D37]">
                    <input
                        value={search}
                        onChange={handleSearch}
                        type="text"
                        placeholder="Search"
                        className="bg-transparent border-none focus:outline-none placeholder:text-[#ECDFCC]/50"
                    />
                    <Image src={lupa} alt="icone" width={22} height={10} />
                </div>
                <div className="flex flex-col gap-4 mt-10" >
                    {loading ? (
                        <p>Carregando...</p>
                    ) : list.length ? (
                        list.map((val) => (
                            <Infor
                                user={val.user}
                                registered={val.registered}
                                pagament={val.pagament}
                                key={val.user.id}
                                update={()=>{
                                    setUpdate(!update);
                                }}
                            />
                        ))
                    ) : (
                        <p>Nenhum dado encontrado.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
