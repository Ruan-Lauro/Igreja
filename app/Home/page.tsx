import { Menu } from "@/components/Menu";
import Image from "next/image";
import img from "@/public/images/acam.webp";
import chil from "@/public/images/chil.png";
import local from "@/public/images/local.png";
import pers from "@/public/images/pers.png";
import bb from "@/public/images/bb.png";
import one from "@/public/images/one.png";
export default function Home (){
    return(
        <main className="bg-[#697565] w-full min-h-[100vh] flex relative" >
            <Menu value="1" />
            <div className="w-full flex flex-col overflow-y-auto items-center text-[#ECDFCC] md:ml-[130px]" >
                <div className="mb-5 w-full h-[700px] relative" >
                    <Image  src={img} objectFit="cover" alt="icone" layout="fill" className="absolute z-1 "/>
                    <div className="absolute bg-black/80 w-full h-full z-2">
                    </div>
                    <div className=" w-[90%] md:w-auto md:ml-0 z-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" >
                        <h1 className="text-[35px] font-bold " >RETIRO ESPIRITUAL MARANATA</h1>
                        <h3 className="text-[20px]" >Junte-se a nós no Retiro Jovem Maranata 2025!</h3>
                    </div>
                </div>
                <div className="w-full flex flex-col text-center xl:text-start xl:flex-row justify-around mt-20 mb-20" >
                    <div className="text-[20px] mt-5 mb-10" >
                        <h2 className="text-[30px] font-bold mb-5" >INFORMAÇÕES:</h2>
                        <p className="text-[#3C3D37] font-bold" >Data:</p>
                        <p >De 28/02 a 05/03 </p>
                        <p className="text-[#3C3D37] font-bold" >Local:</p>
                        <p>Balneário Chácara Paraíso</p>
                        
                    </div>
                    <div className="w-[100%] md:w-[560px] self-center xl:self-start" >
                        <iframe 
                        width="100%" 
                        height="315" 
                        src="https://www.youtube.com/embed/wwwVoCyackQ?si=hczlk0AYkCM9inoP" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                        ></iframe>
                    </div>
                </div>
                <div className="bg-black/80 w-full">
                    <h2 className="text-center text-[30px] font-bold mt-10 mb-10" >PAGAMENTO:</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-10 text-center" >
                        <div className="flex flex-col items-center" >
                            <Image
                                src={bb}
                                alt="Logo"
                                style={{ objectFit: "contain", marginBottom:"10px", marginTop:"10px", }}
                                width={50}
                                height={50}
                            />
                            <p> 6 anos para baixo</p>
                            <p>2,00 R$</p>
                        </div>
                        <div className="flex flex-col items-center" >
                            <Image
                                src={chil}
                                alt="Logo"
                                style={{ objectFit: "contain", marginBottom:"10px", marginTop:"10px", }}
                                width={50}
                                height={50}
                            />
                            <p> 7 anos a 10 anos</p>
                            <p>80,00 R$</p>
                        </div>
                        <div className="flex flex-col items-center" >
                            <Image
                                src={pers}
                                alt="Logo"
                                style={{ objectFit: "contain", marginBottom:"10px", marginTop:"10px", }}
                                width={50}
                                height={50}
                            />
                            <p>10 anos para cima</p>
                            <p>160,00 R$</p>
                        </div>
                        <div className="flex flex-col items-center" >
                            <Image
                                src={local}
                                alt="Logo"
                                style={{ objectFit: "contain", marginBottom:"10px", marginTop:"10px", }}
                                width={50}
                                height={50}
                            />
                            <p>Mais que 100km de distância</p>
                            <p>120,00 R$</p>
                        </div>
                        <div className="flex flex-col items-center" >
                            <Image
                                src={one}
                                alt="Logo"
                                style={{ objectFit: "contain", marginBottom:"10px", marginTop:"10px", }}
                                width={50}
                                height={50}
                            />
                            <p>Diaria</p>
                            <p>35,00 R$</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}