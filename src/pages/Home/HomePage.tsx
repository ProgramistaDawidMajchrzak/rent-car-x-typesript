// src/pages/home/HomePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CarRentalHero } from "./components/CarRentalHero";
import { CarCard } from "../../components/Cars/CarCard";
import Layout from "../../components/Layout/Layout";
import { getCarsHome } from "../../services/cars.service";

type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  pricePerDay: number;
  isAvailable: boolean;
  photoUrl?: string | null;
};

export const HomePage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadCars = async () => {
    try {
      const data = await getCarsHome();
      setCars(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load cars.");
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  return (
    <Layout>
      <CarRentalHero />

      <div className="flex flex-wrap lg:m-32 gap-4">
        {cars.length === 0 && !error && (
          <p className="text-gray-500 text-sm">No cars available.</p>
        )}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {cars.map((car) => (
          <CarCard
            key={car.id}
            name={`${car.brand} ${car.model}`}
            type={car.fuelType}
            year={car.year}
            isAvailable={car.isAvailable}
            fuelType={car.fuelType}
            photoUrl={car.photoUrl}
            price={{
              current: car.pricePerDay,
              original: car.pricePerDay + 20,
            }}
            onRent={() => navigate(`/reservation/${car.id}`)} // 👈 TU
          />
        ))}
      </div>
    </Layout>
  );
};
