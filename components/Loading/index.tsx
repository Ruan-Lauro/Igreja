export const Loading = () => {
    return (
        <div className="fixed w-full flex items-center justify-center h-full bg-black/60 z-[1001]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#ECDFCC] border-solid border-opacity-50"></div>
        </div>
    );
};
  