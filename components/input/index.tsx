import React, { ChangeEvent } from "react";

type AuthInputProps = {
  type: string;
  name: string;
  id: string;
  placeholder: string;
  value: string;
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  erro: boolean;
};

export const AuthInput = ({
    type,
    name,
    id,
    placeholder,
    value,
    onchange,
    required,
    erro
  }: AuthInputProps) => {
    return (
      <input
        className={erro == false?"bg-transparent border-b-[#3C3D37] border-b-[1px] placeholder:text-[#3C3D37] placeholder:font-bold w-full text-[#3C3D37] focus:outline-none pl-[3px] font-bold":"bg-transparent border-b-[red] border-b-[1px] placeholder:text-[#3C3D37] placeholder:font-bold w-full text-[#3C3D37] focus:outline-none pl-[3px] font-bold"}
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onchange}
        required = {required}
      />
    );
  };