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
import Pagination from "@/components/Pagination";
import Spreadsheet from "@/components/Spreadsheet";
import DynamicTable from "@/components/DynamicTable";

// type totalPagament = {
//     paid: number, 
//     unpaid: number,
//     beconfirmed: number
// }

const InforUsers = () => {
    const [user, setUser] = useState<users>();
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [list, setList] = useState<AuthInfor[]>([]);
    const [update, setUpdate] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 10;

    const { authenticationUsers } = useGetUsers();
    const { authenticationRegistered } = useGetRegistered();
    const { authenticationGetPagament } = useGetPagament();

    //Chart analysis
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalRegistered, setTotalRegistered] = useState<number>(0);
    const [listUserWithoutRegistered, setListUserWithoutRegistered] = useState<users[]>();
    // const [totalPagament, setTotalPagament] = useState<totalPagament>();

    const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearch(e.currentTarget.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber: number): void => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const initializeUser = async (): Promise<void> => {
            const element = getCookie("users");
            if (element) {
                try {
                    const parsedUser = element as users;
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
        const fetchData = async (): Promise<void> => {
            setLoading(true);
            try {
                const userV = await authenticationUsers();
                const users = search === "" 
                    ? userV 
                    : userV.filter(fil => fil.name.toLowerCase().includes(search.toLowerCase()));
                const registered = await authenticationRegistered();
                const pagament = await authenticationGetPagament();

                const listNew: AuthInfor[] = users
                    .map((user) => {
                        const regis = registered.find((r) => r.userId === user.id);
                        if (regis) {
                            const paga = pagament.filter((p) => p.registeredId === regis.id);
                            return { user, registered: regis, pagament: paga };
                        }
                        return null;
                    })
                    .filter((item): item is AuthInfor => item !== null).sort((a, b) => a.user.name.localeCompare(b.user.name));
                
                const listUsers: users[] = []  
                users.map((user) => {
                    const regis = registered.find((r) => r.userId === user.id);
                    if (!regis) {
                        listUsers.push(user);
                    }
                })

                if(listUsers.length > 0){
                    setListUserWithoutRegistered(listUsers);
                };
                
                if(userV.length){
                    setTotalUsers(userV.length);
                };
                if(registered.length){
                    setTotalRegistered(registered.length);
                };
                setList(listNew);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [update, search]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <main className="bg-[#697565] w-full min-h-[100vh] flex relative">
            {loading && <Loading />}
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
                <div className="flex flex-col gap-4 mt-10">
                    {loading ? (
                        <p>Carregando...</p>
                    ) : currentItems.length ? (
                        <>
                            {currentItems.map((val) => (
                                <Infor
                                    user={val.user}
                                    registered={val.registered}
                                    pagament={val.pagament}
                                    key={val.user.id}
                                    update={() => setUpdate(!update)}
                                />
                            ))}
                            <Pagination
                                totalItems={list.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        <p>Nenhum dado encontrado.</p>
                    )}
                </div>
                <div className="mt-5 sm:w-[80%] w-full" >
                    <h3 className="text-[30px] mt-5 font-bold" >Análise geral</h3>
                    <div className="mt-5 text-4 mb-20" >
                        <p>Quantidade de usuários: <span className="font-bold" >{totalUsers} pessoas</span></p>
                        <p>Quantidade de pessoas cadastradas: <span className="font-bold" >{totalRegistered} pessoas</span></p>
                        <div className="bg-[#3C3D37] p-4 mt-5" >
                            <p className="text-5 font-bold" >Pessoas que não fizeram seu cadastro: {totalUsers - totalRegistered}</p>
                            {listUserWithoutRegistered?(
                                <React.Fragment>
                                    {listUserWithoutRegistered.map(use=>(
                                        <div className="border-b-2 border-[#ECDFCC] mt-3 pb-3" key={use.id} >
                                            <p className="" key={use.id}>Nome: {use.name}</p>
                                            <p className="" key={use.email}>E-mail: {use.email}</p>
                                        </div>
                                    ))}
                                </React.Fragment>
                            ):(
                                <p>Nenhum caso</p>
                            )}
                        </div>
                    </div>
                    {list.length !== 0?(
                        <Spreadsheet data={list} />
                    ):null}
                    <div className="flex flex-col gap-4 mt-10 w-full justify-self-center">
                        {loading ? (
                            <p>Carregando...</p>
                        ) : list.length ? (
                            <DynamicTable data={list} />
                        ) : (
                            <p>Nenhum dado encontrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default InforUsers;