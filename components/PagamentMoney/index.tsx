import { usePostPagament } from "@/hooks/usePostPagament";

type money = {
    RegisteredId: number;
    number: number;
    value: number;
    twoMethod?: string;
    Start: ()=> void;
    End: ()=> void;
}

export const PagamentMoney = ({RegisteredId, number, value, twoMethod, Start, End}:money) => {

    const {authenticationAddPagament} = usePostPagament();

    const confirmForm = () =>{
        Start();
        const paga = {
            amount: value,
            method:"dinheiro físico",
            quantity: value,
            isPaid: false,
            resAdmin: "Em análise...",
            numbPayment: number,
            registeredId: RegisteredId,
            checking: "Não precisa",
            twoMethod: twoMethod,
        }
        const pagament = authenticationAddPagament(paga);
        pagament.then(res=>{
            if(res === "Payment create"){
                End();
            }else{
                console.log(res)
            }
        });
    }   

    return(
        <div className="max-w-md mt-[30px] bg-[#3C3D37] p-6 rounded-lg mb-[20px]" >
            <p className="text-[#ECDFCC] mt-2" >Confirme e espera a confirmação do usuário admin</p>
            <button
                type="button"
                onClick={()=>{
                    confirmForm();
                }}
                className="w-full bg-[#697565] hover:opacity-80 text-[#ECDFCC] text-lg font-semibold py-2 rounded-md transition"
                >
                Confirmar Pagamento
            </button>
        </div>
    );
}