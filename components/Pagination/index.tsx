interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ 
    totalItems, 
    itemsPerPage, 
    currentPage, 
    onPageChange 
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return (
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-[#3C3D37] text-[#ECDFCC] disabled:opacity-50"
        >
          Anterior
        </button>
        
        <span className="text-[#ECDFCC]">
          Página {currentPage} de {totalPages}
        </span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-[#3C3D37] text-[#ECDFCC] disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    );
  };
  
  export default Pagination;