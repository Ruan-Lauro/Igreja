"use client";

import { Loading } from "@/components/Loading";
import { Menu } from "@/components/Menu";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import perfil from "@/public/images/user.png";
import Image from "next/image";
import cam from "@/public/images/cam.png";
import { InputTwo } from "@/components/inputTwo";
import { useGetUsers, users } from "@/hooks/useGetUsers";
import { EmailConfirm } from "@/components/EmailConfirm";
import { usePutUser } from "@/hooks/usePutUser";

export default function Pagament() {

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [update, setUpdate] = useState(false);
  const [user, setUser] = useState<users>();
  const [profileImage, setProfileImage] = useState<string>(perfil.src);
  const [profile, setProfile] = useState<File>();
  const [codEmail, setCodEmail] = useState(false);

  const {authenticationPutUser} = usePutUser();
  const {authenticationUsers} = useGetUsers();

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        setProfile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(()=>{
      setUpdate(!update);
  },[])

  useEffect(() => {
    setLoading(true);
    const element = localStorage.getItem("meuDado");
    if (element) {
      try {
        const parsedUser = JSON.parse(element);
        if (parsedUser && typeof parsedUser === "object") {
          setName(parsedUser.name);
          setEmail(parsedUser.email);
          setUser(parsedUser);
          console.log("Passei aqui")
          console.log(parsedUser);
          setLoading(false);
          if(parsedUser.imgUser){
            setProfileImage(parsedUser.imgUser);
          }
        }
      } catch (error) {
        console.error("Erro ao parsear o JSON:", error);
      }
    }
  }, [update]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    ); 
    formData.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
    ); 

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url; 
    } catch (error) {
      console.error("Erro ao enviar imagem para o Cloudinary:", error);
      return null;
    }
  };

  const handleForm = async (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    setLoading(true);

    if(email !== user?.email){
      setCodEmail(true);
      setLoading(false);
      return
    }

    if(profileImage !== perfil.src && profile){
      const img = await uploadImage(profile);
      const userL = {
        imgUser: img,
        name,
        email,
        id: user.id
      }

      const res = authenticationPutUser(userL)
      res.then(v=>{
        if(v === "User edited"){
          setLoading(false);
          setUpdate(!update);
          updateLocalStorage();
        }
      });
    }else{
      const userL = {
        name,
        id: user.id
      }

      const res = authenticationPutUser(userL)
      res.then(v=>{
        if(v === "User edited"){
          setLoading(false);
          setUpdate(!update);
          updateLocalStorage();
        }
      });
    }

  };

  const handleConfirmEmail = async () =>{
    setLoading(true);
    setCodEmail(false);
    if(user){
      if(profileImage !== perfil.src && profile){
        const img = await uploadImage(profile);
        const userL = {
          imgUser: img,
          name,
          email,
          id: user.id
        }
  
        const res = authenticationPutUser(userL)
        res.then(v=>{
          if(v === "User edited"){
            setLoading(false);
            updateLocalStorage()
          }
        });
      }else{
        const userL = {
          name,
          email,
          id: user.id
        }
  
        const res = authenticationPutUser(userL)
        res.then(v=>{
          if(v === "User edited"){
            setLoading(false);
            updateLocalStorage()
          }
        });
      }
    }
  };

  const updateLocalStorage = () =>{
    localStorage.clear();
    const listUser = authenticationUsers();
    listUser.then(res=>{
      res.find(val=> val.id === user?.id);
      localStorage.setItem("meuDado", JSON.stringify(res[0]));
      console.log(res[0])
      setLoading(false);
      setUpdate(!update);
    })
  }

  return (
    <main className="bg-[#697565] w-full h-[100vh] flex relative">
      {loading && <Loading />}
      {codEmail?(
        <div className="z-[1001] w-full h-full absolute flex justify-center items-center bg-black/50" >
          <EmailConfirm exitConfirm={()=>{
            setCodEmail(false);
          }} email={email} autheConfirm={handleConfirmEmail} />
        </div>
        ):null}
      <Menu value="2" />
      <div className="w-full flex flex-col overflow-y-auto items-center md:ml-40 mt-20">
        <div className="relative border-[#ECDFCC] border-4 rounded-[100%] w-40 h-40 z-[1]">
          <Image  src={profileImage} alt="icone" layout="fill" objectFit="cover" className="rounded-[100%]"/>
          <div
            className="absolute bg-[#697565] pl-2 pr-2 pt-2 pb-2 border-[#ECDFCC] border-2 rounded-[100%] right-[-20px] top-[50%] cursor-pointer"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <Image src={cam} alt="icone" width={30} height={30} />
          </div>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <p className="text-[#ECDFCC] mt-5 mb-3" >Clique no campo e edite seu nome, o seu e-mail ou na imagem de câmera.</p>
        <form onSubmit={handleForm} className="flex flex-col items-center w-[80%] md:w-[600px] gap-3">
          <InputTwo
            name={name}
            onchange={handleName}
            placeholder="Nome"
            value={name}
            id="1"
            type="text"
            required
            erro
          />
          <InputTwo
            name={email}
            onchange={handleEmail}
            placeholder="E-mail"
            value={email}
            id="1"
            type="text"
            required
            erro
          />
          <div className="flex gap-3" >
            <button className="bg-[#3C3D37] hover:bg-black/40 w-[140px] h-[50px] rounded-[10px] text-[#ECDFCC] font-bold mt-[20px] self-center  mb-2">
              EDITAR
            </button>
            {name !== user?.name || email !== user.email?(
              <button type="reset" onClick={()=>{
  
                setLoading(false);
              }} className="bg-[#3C3D37] hover:bg-black/40 w-[140px] h-[50px] rounded-[10px] text-[#ECDFCC] font-bold mt-[20px] self-center  mb-2">
              CANCELAR
            </button>
            ):null}
          </div>
        </form>
      </div>
    </main>
  );
}
