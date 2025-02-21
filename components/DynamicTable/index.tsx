import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { AuthInfor } from "@/components/Infor";

interface TableRow {
  name: string;
  email: string;
  createdAt: string;
  phoneNumber: string;
  birthDate: string;
  cpf: string;
  sex: string;
  city: string;
  state: string;
  plan: string;
  paymentStatus: string;
  amount: string;
  method: string;
  paymentDate: string;
}

type SortConfig = {
  key: keyof TableRow;
  direction: 'asc' | 'desc';
} | null;

const DynamicTable = ({ data }: { data: AuthInfor[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [visibleColumns, setVisibleColumns] = useState<Record<keyof TableRow, boolean>>({
    name: true,
    email: true,
    createdAt: false,
    phoneNumber: true,
    birthDate: false,
    cpf: true,
    sex: false,
    city: true,
    state: true,
    plan: true,
    paymentStatus: true,
    amount: true,
    method: true,
    paymentDate: false
  });
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const tableData = useMemo((): TableRow[] => {
    return data.map(item => ({
      name: item.user.name,
      email: item.user.email,
      createdAt: new Date(item.user.createdAt!).toLocaleDateString(),
      phoneNumber: item.registered.phoneNumber,
      birthDate: new Date(item.registered.birthDate).toLocaleDateString(),
      cpf: item.registered.cpf,
      sex: item.registered.sex,
      city: item.registered.city,
      state: item.registered.state,
      plan: item.registered.plan,
      paymentStatus: item.pagament && item.pagament.length > 0 
        ? (item.pagament[item.pagament.length - 1].isPaid ? 'Pago' : 'Pendente')
        : 'Sem pagamento',
      amount: item.pagament && item.pagament.length > 0 
        ? `R$ ${item.pagament[item.pagament.length - 1].amount}`
        : 'N/A',
      method: item.pagament && item.pagament.length > 0 
        ? item.pagament[item.pagament.length - 1].method
        : 'N/A',
      paymentDate: item.pagament && item.pagament.length > 0 
        ? new Date(item.pagament[item.pagament.length - 1].createdAt).toLocaleDateString()
        : 'N/A'
    }));
  }, [data]);

  const columnLabels: Record<keyof TableRow, string> = {
    name: 'Nome',
    email: 'Email',
    createdAt: 'Data de Cadastro',
    phoneNumber: 'Telefone',
    birthDate: 'Data de Nascimento',
    cpf: 'CPF',
    sex: 'Sexo',
    city: 'Cidade',
    state: 'Estado',
    plan: 'Plano',
    paymentStatus: 'Status',
    amount: 'Valor',
    method: 'Método',
    paymentDate: 'Data do Pagamento'
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = tableData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      filtered.sort((a: TableRow, b: TableRow) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) 
          return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) 
          return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [tableData, searchTerm, sortConfig]);

  const handleSort = (key: keyof TableRow) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const toggleColumn = (columnKey: keyof TableRow) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Pesquisar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded bg-[#3C3D37] text-[#ECDFCC] w-64 max-sm:w-[60%]"
        />
        <button
          onClick={() => setShowColumnSelector(!showColumnSelector)}
          className="flex items-center gap-2 bg-[#3C3D37] text-[#ECDFCC] px-4 py-2 rounded hover:bg-[#4a4b44] max-sm:w-[30%]"
        >
          <Settings2 size={18} />
          Colunas
        </button>
      </div>

      {showColumnSelector && (
        <div className="mb-4 p-4 bg-[#3C3D37] rounded">
          <h3 className="mb-2 font-bold">Selecionar Colunas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {(Object.entries(columnLabels) as [keyof TableRow, string][]).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={visibleColumns[key]}
                  onChange={() => toggleColumn(key)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#3C3D37]">
              {(Object.entries(columnLabels) as [keyof TableRow, string][]).map(([key, label]) => 
                visibleColumns[key] && (
                  <th
                    key={key}
                    className="p-2 text-left cursor-pointer hover:bg-[#4a4b44]"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {sortConfig?.key === key && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp size={16} /> : 
                          <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((item, index) => (
              <tr 
                key={index}
                className="border-b border-l border-[#3C3D37] hover:bg-[#3C3D37]/40"
              >
                {(Object.entries(columnLabels) as [keyof TableRow, string][]).map(([key]) => 
                  visibleColumns[key] && (
                    <td key={key} className="p-2 border-r border-[#3C3D37]">
                      {item[key]}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm">
        Total de registros: {filteredAndSortedData.length}
      </div>
    </div>
  );
};

export default DynamicTable;