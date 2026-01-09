import React from 'react';

interface ButtonProps {
    value: string;
    onClick?: () => void; // <-- NOWE
}

export const Button: React.FC<ButtonProps> = ({ value, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="mx-auto my-0 h-11 text-base font-semibold text-white rounded bg-slate-900 w-[116px] hover:opacity-90"
  >
    {value}
  </button>
);
