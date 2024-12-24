import { usePostPagament } from "@/hooks/usePostPagament";
import { useState } from "react";

type Pix = {
  idRegistered: number;
  value: number;
  number: number;
  twoMethod?: string;
  Start: ()=> void;
  End: ()=> void;
};

export const PagamentPix = ({ idRegistered, value, number, twoMethod, Start, End }: Pix) => {

  const [checkImg, setCheckImg] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");

  //hooks
  const {authenticationAddPagament} = usePostPagament();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCheckImg(e.target.files[0]); 
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Start();
    if (!checkImg) {
      alert("Por favor, selecione uma imagem para enviar.");
      End();
      return;
    }

    const imageUrl = await uploadImage(checkImg);
    if (imageUrl) {
        const pagament = {
            amount: value,
            method:"Pix",
            quantity: value,
            isPaid: false,
            resAdmin: "Em análise...",
            numbPayment: number,
            registeredId: idRegistered,
            checking: imageUrl,
            twoMethod,
          };
        
        const res = authenticationAddPagament(pagament);
        res.then(val=>{
          if(val === "Payment create"){
            End();
          }
        });
    }
  };

  return (
    <div className="max-w-md mt-[30px] bg-[#3C3D37] p-6 rounded-lg mb-[20px]">
      <h2 className="text-2xl font-bold text-center text-[#ECDFCC] mb-4">
        Pagamento por pix
      </h2>
      <form onSubmit={handleSubmit} className="text-[#ECDFCC]">
        <h2 className="text-[20px]">Envie para esse pix:</h2>
        <h2 className="text-[20px] text-white font-bold mb-2">89988258259</h2>
        <p>
          Depois do envio coloque o comprovante nesse campo abaixo, para que possamos comprovar sua
          inscrição.
        </p>

        <div className="mt-4 mb-4">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-[#ECDFCC] mb-1">
            Comprovante do pix
          </label>
          <input
            type="file"
            id="cardNumber"
            onChange={handleFileChange}
            className="block w-full bg-[#ECDFCC] text-[#556b5d] rounded-md shadow-sm border border-gray-300 text-lg px-3 py-2 tracking-widest"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#697565] text-[#ECDFCC] text-lg font-semibold py-2 rounded-md hover:bg-[#697565]/50 transition"
        >
          Confirmar Pagamento
        </button>
      </form>
      {imgUrl && (
        <div className="mt-4">
          <p className="text-[#ECDFCC]">Imagem enviada com sucesso:</p>
          <a href={imgUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400">
            Ver Comprovante
          </a>
        </div>
      )}
    </div>
  );
};
