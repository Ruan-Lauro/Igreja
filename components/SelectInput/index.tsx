import React, { ChangeEvent } from "react";

type SelectInputProps = {
  name: string;
  id: string;
  placeholder: string;
  value: string;
  onchange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required: boolean;
  erro: boolean;
  options: string[];
};

export const SelectInput = ({
  name,
  id,
  placeholder,
  value,
  onchange,
  required,
  erro,
  options,
}: SelectInputProps) => {
  return (
    <div className="flex flex-col w-[100%] min-w-[250px]">
      <label htmlFor={name} className="text-[16px] text-[#ECDFCC]">
        {placeholder}
      </label>
      <select
        name={name}
        id={id}
        value={value}
        onChange={onchange}
        required={required}
        className={erro?`w-[100%] bg-[#ECDFCC] rounded-[10px] h-[35px] text-[#3C3D37] focus:outline-none pl-5 pr-10`:`w-[100%] bg-[#ECDFCC] rounded-[10px] h-[35px] text-[#3C3D37] focus:outline-none pl-5 pr-10`}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
