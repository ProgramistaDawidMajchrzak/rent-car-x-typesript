import React from "react";
import { Icon } from "../Icon";
import { Button } from "../Form/Button";

interface CarCardProps {
  name: string;
  type: string;
  year: number;
  isAvailable: boolean;
  fuelType: string;
  price: {
    current: number;
    original: number;
  };
  photoUrl?: string | null;
  onRent?: () => void; // 👈 NOWE
}

export const CarCard: React.FC<CarCardProps> = ({
  name,
  type,
  year,
  isAvailable,
  fuelType,
  price,
  photoUrl,
  onRent,
}) => {
  return (
    <div className="box-border flex relative flex-col p-6 bg-white rounded-xl h-[368px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] w-[290px] max-md:w-full">
      {/* TOP */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{name}</span>
          <span className="text-sm font-bold text-slate-400">{type}</span>
        </div>
      </div>

      {/* IMAGE */}
      {photoUrl ? (
        <img
          src={`http://localhost:5113${photoUrl}`}
          alt={name}
          className="w-full h-32 object-contain rounded-xl bg-white"
        />
      ) : (
        <div className="w-full h-32 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">
          No photo
        </div>
      )}

      {/* SPECYFIKACJE */}
      <div className="flex justify-between items-center mt-8 mb-4 text-xs font-medium">
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700">
          {fuelType}
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
          {year}
        </span>
        <span
          className={
            "px-3 py-1 rounded-full " +
            (isAvailable
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600")
          }
        >
          {isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* PRICE + BUTTON */}
      <div className="flex flex-row justify-between items-center mb-4">
        <div>
          <div className="text-xl font-bold text-gray-900">
            <span>${price.current.toFixed(2)}/</span>
            <span className="text-sm text-slate-400">day</span>
          </div>
          <div className="text-sm font-bold line-through text-slate-400">
            ${price.original.toFixed(2)}
          </div>
        </div>

        <Button value="Rent Now" onClick={onRent} />
      </div>
    </div>
  );
};