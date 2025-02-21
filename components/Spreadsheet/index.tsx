import React from 'react';
import * as XLSX from 'xlsx';
import { AuthInfor } from "@/components/Infor";

interface ExcelExportProps {
  data: AuthInfor[];
}

const Spreadsheet: React.FC<ExcelExportProps> = ({ data }) => {
  const exportToExcel = () => {

    const excelData = data.map((item) => {

      const baseData = {

        "Nome do Usuário": item.user.name,
        "Email": item.user.email,
        "Data de Cadastro": new Date(item.user.createdAt!).toLocaleDateString(),
        
        "Telefone": item.registered.phoneNumber,
        "Data de Nascimento": new Date(item.registered.birthDate).toLocaleDateString(),
        "CPF": item.registered.cpf,
        "Sexo": item.registered.sex,
        "Alergia": item.registered.allergy ? "Sim" : "Não",
        "Detalhes da Alergia": item.registered.allergyDetails || "N/A",
        "Medicação": item.registered.medication ? "Sim" : "Não",
        "Detalhes da Medicação": item.registered.medicationDetails || "N/A",
        "Nome do Responsável": item.registered.guardianName || "N/A",
        "Número de Emergência": item.registered.numberEmergency,
        "Cidade": item.registered.city,
        "Estado": item.registered.state,
        "Bairro": item.registered.neighborhood,
        "CEP": item.registered.zipCode,
        "Número": item.registered.number,
        "Ponto de Referência": item.registered.referencePoint,
        "Plano": item.registered.plan,
      };

      if (!item.pagament || item.pagament.length === 0) {
        return {
          ...baseData,
          "Status do Pagamento": "Sem pagamento",
          "Valor": "N/A",
          "Método": "N/A",
          "Segundo Método": "N/A",
          "Quantidade": "N/A",
          "Número do Pagamento": "N/A",
          "Data do Pagamento": "N/A",
        };
      }

      return item.pagament.map((payment) => ({
        ...baseData,
        "Status do Pagamento": payment.isPaid ? "Pago" : "Pendente",
        "Valor": payment.amount,
        "Método": payment.method,
        "Segundo Método": payment.twoMethod || "N/A",
        "Quantidade": payment.quantity,
        "Número do Pagamento": payment.numbPayment,
        "Data do Pagamento": new Date(payment.createdAt).toLocaleDateString(),
        "Resposta do Admin": payment.resAdmin || "N/A",
        "Status de Verificação": payment.checking || "N/A",
      }));
    });

    const flattenedData = excelData.flat();

    const ws = XLSX.utils.json_to_sheet(flattenedData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados dos Usuários");

    XLSX.writeFile(wb, "dados_usuarios.xlsx");
  };

  return (
    <button
      onClick={exportToExcel}
      className="bg-[#3C3D37] text-[#ECDFCC] px-4 py-2 rounded hover:bg-[#4a4b44] transition-colors"
    >
      Exportar para Excel
    </button>
  );
};

export default Spreadsheet;