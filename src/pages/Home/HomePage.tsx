import React from 'react';
import {CarRentalHero} from './components/CarRentalHero';
import { Navigation } from '../../components/Navigation/Navigation';
import { CarCard } from '../../components/Cars/CarCard';

export const HomePage: React.FC = () => {
   const carData = {
    name: "All New Rush",
    type: "SUV",
    specs: {
      gas: "70L",
      gear_box: "Manual",
      capacity: "6 People"
    },
    price: {
      current: 72,
      original: 80
    }
  };
  return (
    <>
      <CarRentalHero />
      <div className='flex flex-4 flex-wrap m-32 gap-4'>
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
        <CarCard {...carData} />
      </div>
    </>
  );
};
