import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CarRentalHero } from "./components/CarRentalHero";
import { CarCard } from "../../components/Cars/CarCard";
import Layout from "../../components/Layout/Layout";
import { getCars } from "../../services/cars/service";

type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  pricePerDay: number;
  isAvailable: boolean;
  imageUrl?: string | null;
};

const PAGE_SIZE = 16;

function parseCarsResponse(data: any): {
  items: Car[];
  totalPages?: number;
  totalCount?: number;
} {
  if (Array.isArray(data)) return { items: data };

  const items: Car[] = data?.items ?? data?.data ?? data?.results ?? [];
  const totalPages: number | undefined = data?.totalPages ?? data?.pages;
  const totalCount: number | undefined = data?.totalCount ?? data?.totalItems ?? data?.count;

  return { items, totalPages, totalCount };
}

export const HomePage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const navigate = useNavigate();

  const loadCars = async (pageNumber: number) => {
    setError("");
    setIsLoading(true);

    try {
      const data = await getCars({
        pageNumber,
        pageSize: PAGE_SIZE,
      });

      const parsed = parseCarsResponse(data);

      setCars(parsed.items);
      setTotalPages(parsed.totalPages ?? null);
      setTotalCount(parsed.totalCount ?? null);
    } catch (err) {
      console.error(err);
      setError("Unable to load cars.");
      setCars([]);
      setTotalPages(null);
      setTotalCount(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCars(page);
  }, [page]);

  const canPrev = page > 1;
  const canNext =
    totalPages !== null ? page < totalPages : cars.length === PAGE_SIZE;

  return (
    <Layout>
      <CarRentalHero />

      <div className="flex flex-col lg:m-32 m-6 gap-4">
        {/* Top bar: status + pagination info */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700">
            {isLoading
              ? "Loading..."
              : `Showing ${cars.length}${totalCount !== null ? ` of ${totalCount}` : ""} cars`}
          </div>
          <div className="text-sm text-slate-700">
            Page {page}
            {totalPages !== null ? ` / ${totalPages}` : ""}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!error && !isLoading && cars.length === 0 && (
          <p className="text-gray-500 text-sm">No cars available.</p>
        )}

        {/* Cars */}
        <div className="flex flex-wrap gap-4">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              name={`${car.brand} ${car.model}`}
              type={car.fuelType}
              year={car.year}
              isAvailable={car.isAvailable}
              fuelType={car.fuelType}
              imageUrl={car.imageUrl}
              price={{
                current: car.pricePerDay,
                original: car.pricePerDay,
              }}
              onRent={() => navigate(`/reservation/${car.id}`, { state: { car } })}
            />
          ))}
        </div>

        {/* Pagination */}
        {cars.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev || isLoading}
              className="px-3 h-[30px] text-xs font-bold rounded border border-slate-900 disabled:opacity-40"
            >
              Prev
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!canNext || isLoading}
              className="px-3 h-[30px] text-xs font-bold rounded border border-slate-900 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};
