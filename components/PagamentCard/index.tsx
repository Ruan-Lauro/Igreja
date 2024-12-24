import { useState, useEffect } from "react";
import axios from "axios";
import { usePostPagament } from "@/hooks/usePostPagament";
import { redirect } from "next/dist/server/api-utils";

type CardProps = {
  value: number; 
  idRegistered: number;
  email: string;
  number: number;
  twoMethod?: string;
  Start: ()=> void;
  End: ()=> void;  
};

export const PagamentCard = ({ value, idRegistered, email, number, twoMethod, Start, End }: CardProps) => {

  //UseState data of the card <--->
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [installments, setInstallments] = useState(1);
  const [cardFlag, setCardFlag] = useState("");
  const [installmentOptions, setInstallmentOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  //hooks <--->
  const {authenticationAddPagament} = usePostPagament();

  //Format card
  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatCardNumber = (value: string) =>
    value.replace(/[^0-9]/g, "").replace(/(.{4})/g, "$1 ").trim();

  const formatExpiryDate = (value: string) =>
    value.replace(/[^0-9]/g, "").replace(/(\d{2})(\d{1,2})/, "$1/$2").slice(0, 5);

  //Functions <--->

  const detectCardFlag = async (cardNumber: string) => {
    const bin = cardNumber.replace(/\s/g, "").slice(0, 6);
    if (bin.length < 6 || cardFlag) return;
  
    try {
      const response = await axios.get(
        `https://api.mercadopago.com/v1/payment_methods/search?bin=${bin}&site_id=MLB`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );
      if (response.data.results.length > 0) {
        setCardFlag(response.data.results[0].id);
      } else {
        setCardFlag("");
      }
    } catch (error) {
      console.error("Erro ao detectar bandeira do cartão:", error);
      setCardFlag("");
    }
  };

  const fetchInstallmentOptions = async () => {
    try {
      const response = await axios.post(`/api/installment/`,{
        value: value,
        cardFlag: cardNumber.replace(/\s/g, "").slice(0, 6)
      }
      );
  
      if(response.data){
        setInstallmentOptions(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar opções de parcelas:", error);
      generateFallbackInstallments();
    }
  };
  
  const generateFallbackInstallments = () => {
    const fallbackOptions = Array.from({ length: 12 }, (_, index) => {
      const installment = index + 1;
      const monthlyRate = 0.05; 
      const total = value * Math.pow(1 + monthlyRate, installment);
      return {
        installments: installment,
        total,
        message: `${installment}x de ${formatCurrency(total / installment)} (${formatCurrency(
          total
        )} no total)`,
      };
    });
    setInstallmentOptions(fallbackOptions);
  };

  //UseEffect <--->

  //Get card installments
  useEffect(() => {
    if (cardFlag) {
      fetchInstallmentOptions();
    }
  }, [cardFlag]);

  //Connection script MercadoPago
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => {
      if (window.MercadoPago) {
        const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, {
          locale: "pt-BR",
        });
      }
    };
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  
  //Get card number
  const handleCardNumberChange = (value: string) => {
    const formattedValue = formatCardNumber(value);
    setCardNumber(formattedValue);
    detectCardFlag(formattedValue);
  };

  //Function of the form <--->
   
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Start();
    setLoading(true);
    try {
      const mercadopago = (window as any).MercadoPago
        ? new (window as any).MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY)
        : null;
  
      if (!mercadopago) {
        console.error("MercadoPago SDK não carregado corretamente");
        alert("Erro ao carregar o SDK do Mercado Pago.");
        End();
        setLoading(false);
        return;
      }
  
      if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert("Por favor, insira uma data de validade válida no formato MM/YY.");
        End();
        setLoading(false);
        return;
      }
  
      const [month, year] = expiryDate.split("/");
  
      const cardData = {
        cardNumber: cardNumber.replace(/\s/g, ""), 
        cardholderName: cardHolder,
        cardExpirationMonth: month+"", 
        cardExpirationYear: `20${year}`, 
        securityCode: cvv, 
      };
  
      const cardTokenResponse = await mercadopago.createCardToken(cardData);
  
      if (!cardTokenResponse || !cardTokenResponse.id) {
        throw new Error("Não foi possível gerar o token do cartão.");
      }
      
      const newValue = installmentOptions.filter(v=>v.installments === installments);

      const paymentData = {
        amount: newValue[0].total, 
        cardToken: cardTokenResponse.id, 
        installments, 
        email, 
        paymentMethodId: cardFlag, 
      };

      const response = await axios.post("/api/infinitepay/", paymentData, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200 && response.data.status === "approved") {
        const pag = {
          amount: value,
          method: "cartão de crédito",
          quantity: newValue[0].total,
          isPaid: true,
          resAdmin: "Já foi pago!",
          checking: "Não precisa",
          numbPayment: number,
          registeredId: idRegistered,
          twoMethod,
        }
        const res = authenticationAddPagament(pag);
        res.then(vl => {
          if(vl === "Payment create"){
            End();
            setLoading(false);
          }else{
            End();
            setLoading(false);
          }
        });
      } else {
        alert("Ocorreu um erro ao realizar o pagamento.");
        End();
        setLoading(false);
      }
  
    } catch (error) {
      console.error("Erro no pagamento:", error);
      alert("Ocorreu um erro ao processar o pagamento. Verifique os dados e tente novamente.");
      End();
      setLoading(false);
    } finally {
      
    }
  };
  
  
  return (
    <div className="max-w-md mt-[30px] bg-[#3C3D37] p-6 rounded-lg mb-[20px]">
      <h2 className="text-2xl font-bold text-center text-[#ECDFCC] mb-4">
        Informações do Cartão de Crédito
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-[#ECDFCC] mb-1">
            Número do Cartão
          </label>
          <input
            type="text"
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            maxLength={19}
            className="block w-full bg-[#ECDFCC] text-[#556b5d] rounded-md shadow-sm border border-gray-300 text-lg px-3 py-2 tracking-widest"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="installments" className="block text-sm font-medium text-[#ECDFCC] mb-1">
            Parcelamento
          </label>
          <select
            id="installments"
            value={installments}
            onChange={(e) => setInstallments(Number(e.target.value))}
            className="block w-full bg-[#ECDFCC] text-[#556b5d] rounded-md shadow-sm border border-gray-300 text-lg px-3 py-2"
          >
            {installmentOptions.map((option) => (
              <option key={option.installments} value={option.installments}>
                {option.message}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="cardHolder" className="block text-sm font-medium text-[#ECDFCC] mb-1">
            Nome do Titular
          </label>
          <input
            type="text"
            id="cardHolder"
            placeholder="Nome no cartão"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            className="block w-full bg-[#ECDFCC] text-[#556b5d] rounded-md shadow-sm border border-gray-300 text-lg px-3 py-2"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-[#ECDFCC] mb-1">
              Validade
            </label>
            <input
              type="text"
              id="expiryDate"
              placeholder="MM/AA"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              maxLength={5}
              className="block w-full bg-[#ECDFCC] text-[#556b5d] rounded-md shadow-sm border border-gray-300 text-lg px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-[#ECDFCC] mb-1">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength={3}
              className="block w-full bg-[#ECDFCC] text-[#556b5d] rounded-md shadow-sm border border-gray-300 text-lg px-3 py-2"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#697565] hover:opacity-80 text-[#ECDFCC] font-medium py-2 px-4 rounded"
        >
          {loading ? "Processando..." : "Confirmar Pagamento"}
        </button>
      </form>
    </div>
  );
};