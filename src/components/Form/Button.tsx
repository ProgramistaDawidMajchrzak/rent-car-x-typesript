import React from 'react';

interface ButtonProps {
    value: string;
}

export const Button = ({value}: ButtonProps) => (
  <button className="mx-auto my-0 h-11 text-base font-semibold text-white rounded bg-slate-900 w-[116px]">
    {value}
  </button>
);