import React from 'react';
import {CarRentalHero} from './components/CarRentalHero';
import { CarCard } from '../../components/Cars/CarCard';
import Layout from '../../components/Layout/Layout';

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
    <Layout>
      <CarRentalHero />
      <div className='flex flex-4 flex-wrap lg:m-32 gap-4'>
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
    </Layout>
  );
};
