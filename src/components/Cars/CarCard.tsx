import React from "react";
import { Icon } from "../Icon";
import { Image } from "../Image";
import { Button } from "../Form/Button";


interface CarCardProps {
    name: string;
    type: string;
    specs: {
      gas: string;
      gear_box: string;
      capacity: string;
    };
    price: {
      current: number;
      original: number;
    };
  }
  
  export const CarCard: React.FC<CarCardProps> = ({ name, type, specs, price }) => {
    return (
      <div className="box-border flex relative flex-col p-6 bg-white rounded-xl h-[368px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] w-[304px] max-md:w-full max-md:max-w-[304px] max-sm:w-full max-sm:max-w-[304px]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{name}</span>
            <span className="text-sm font-bold text-slate-400">{type}</span>
          </div>
          <Icon name="heart" className="w-4 h-4" />
        </div>
        <Image name="car" className="w-full rounded-xl" alt="Sport car" />
        <div className="flex justify-between items-center mt-8 mb-4">
          <CarSpec icon="gas" value={specs.gas} />
          <CarSpec icon="gear_box" value={specs.gear_box} />
          <CarSpec icon="people" value={specs.capacity} />
        </div>
        <div className="flex flex-row justify-center items-center mb-4">
          <div>
            <div className="text-xl font-bold text-gray-900">
              <span>${price.current.toFixed(2)}/</span>
              <span className="text-sm text-slate-400">day</span>
            </div>
            <div className="text-sm font-bold line-through text-slate-400">
              ${price.original.toFixed(2)}
            </div>
          </div> 
          <Button value="Rent Now"/>
        </div>
      </div>
    );
  };



interface CarSpecProps {
  icon: 'gas' | 'gear_box' | 'people';
  value: string;
}

export const CarSpec: React.FC<CarSpecProps> = ({ icon, value }) => {
  return (
    <div className="flex gap-1.5 items-center">
      <Icon name={icon} className="w-4 h-4" />
      <span>{value}</span>
    </div>
  );
};