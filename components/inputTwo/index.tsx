import React, { ChangeEvent } from "react";

type AuthInputTwo = {
  type: string;
  name: string;
  id: string;
  placeholder: string;
  value: string;
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  erro: boolean;
  minL?: number;
  maxL?: number;

};

export const InputTwo = ({
    type,
    name,
    id,
    placeholder,
    value,
    onchange,
    required,
    erro,
  }: AuthInputTwo) => {
    return (
      <div className="flex flex-col w-[100%] min-w-[200px]" >
        <label htmlFor={name} className="text-[16px] text-[#ECDFCC]" >{placeholder}</label>
        <input 
          className={erro?`w-[100%] bg-[#ECDFCC] rounded-[10px] h-[35px] text-[#3C3D37] focus:outline-none pl-5 pr-1 appearance-none`:`w-[100%] bg-[#ECDFCC] rounded-[10px] h-[35px] text-[#3C3D37] focus:outline-none pl-5 pr-1 appearance-none`}
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={onchange}
          required = {required}
          // placeholder={name}
          
          />
      </div>
    );
  };