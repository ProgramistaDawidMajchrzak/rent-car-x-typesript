import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout/Layout";
import { CarRentalHeroCompact } from "../Home/components/CarRentalHeroCompact";
import { CarCard } from "../../components/Cars/CarCard";
import { getCars } from "../../services/cars/service";

import { brands, fuelTypes, getModelsByBrand } from "../../helpers/carSchema";

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

type Availability = "ALL" | "AVAILABLE" | "UNAVAILABLE";

type Filters = {
  brand: string | null;
  model: string | null;
  fuelType: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  isAvailable: boolean | null;
};

const emptyFilters: Filters = {
  brand: null,
  model: null,
  fuelType: null,
  minPrice: null,
  maxPrice: null,
  isAvailable: null,
};

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

export const CarListPage: React.FC = () => {
  const navigate = useNavigate();

  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const [draftBrand, setDraftBrand] = useState("");
  const [draftModel, setDraftModel] = useState("");
  const [draftFuelType, setDraftFuelType] = useState("");
  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");
  const [draftAvailability, setDraftAvailability] = useState<Availability>("ALL");

  const [applied, setApplied] = useState<Filters>(emptyFilters);

  const availableModels = useMemo(
    () => (draftBrand ? getModelsByBrand(draftBrand) : []),
    [draftBrand]
  );
  const modelDisabled = !draftBrand;

  const appliedLabelChips = useMemo(() => {
    const chips: { key: keyof Filters; label: string }[] = [];
    if (applied.brand) chips.push({ key: "brand", label: `Brand: ${applied.brand}` });
    if (applied.model) chips.push({ key: "model", label: `Model: ${applied.model}` });
    if (applied.fuelType) chips.push({ key: "fuelType", label: `Fuel: ${applied.fuelType}` });
    if (applied.minPrice) chips.push({ key: "minPrice", label: `Min: ${applied.minPrice}` });
    if (applied.maxPrice) chips.push({ key: "maxPrice", label: `Max: ${applied.maxPrice}` });

    if (applied.isAvailable === true) chips.push({ key: "isAvailable", label: "Available only" });
    if (applied.isAvailable === false) chips.push({ key: "isAvailable", label: "Unavailable only" });

    return chips;
  }, [applied]);

  const loadCars = async (filters: Filters, pageNumber: number) => {
    setError("");
    setIsLoading(true);

    try {
      const params: any = {
        pageNumber,
        pageSize: PAGE_SIZE,
      };

      if (filters.brand) params.brand = filters.brand;
      if (filters.model) params.model = filters.model;
      if (filters.fuelType) params.fuelType = filters.fuelType;

      if (filters.minPrice && !Number.isNaN(Number(filters.minPrice))) {
        params.minPrice = Number(filters.minPrice);
      }
      if (filters.maxPrice && !Number.isNaN(Number(filters.maxPrice))) {
        params.maxPrice = Number(filters.maxPrice);
      }

      if (filters.isAvailable !== null) params.isAvailable = filters.isAvailable;

      const data = await getCars(params);
      const parsed = parseCarsResponse(data);

      setCars(parsed.items);
      setTotalPages(parsed.totalPages ?? null);
      setTotalCount(parsed.totalCount ?? null);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Unable to load cars.");
      setCars([]);
      setTotalPages(null);
      setTotalCount(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCars(applied, page);
  }, [applied, page]);

  const applyFilters = () => {
    const nextApplied: Filters = {
      brand: draftBrand.trim() ? draftBrand.trim() : null,
      model: draftModel.trim() ? draftModel.trim() : null,
      fuelType: draftFuelType.trim() ? draftFuelType.trim() : null,
      minPrice: draftMinPrice.trim() ? draftMinPrice.trim() : null,
      maxPrice: draftMaxPrice.trim() ? draftMaxPrice.trim() : null,
      isAvailable:
        draftAvailability === "ALL"
          ? null
          : draftAvailability === "AVAILABLE"
          ? true
          : false,
    };

    setPage(1);
    setApplied(nextApplied);
  };

  const clearAll = () => {
    setDraftBrand("");
    setDraftModel("");
    setDraftFuelType("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setDraftAvailability("ALL");

    setPage(1);
    setApplied(emptyFilters);
  };

  const removeChip = (key: keyof Filters) => {
    const next: Filters = { ...applied, [key]: null };

    if (key === "brand") next.model = null;

    setPage(1);
    setApplied(next);

    if (key === "brand") {
      setDraftBrand("");
      setDraftModel("");
    }
    if (key === "model") setDraftModel("");
    if (key === "fuelType") setDraftFuelType("");
    if (key === "minPrice") setDraftMinPrice("");
    if (key === "maxPrice") setDraftMaxPrice("");
    if (key === "isAvailable") setDraftAvailability("ALL");
  };

  const canPrev = page > 1;
  const canNext =
    totalPages !== null ? page < totalPages : cars.length === PAGE_SIZE;

  const totalLabel = totalCount !== null ? totalCount : cars.length;

  return (
    <Layout>
      <CarRentalHeroCompact />

      <div className="px-6 lg:px-32 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters */}
          <aside className="w-full lg:w-[320px]">
            <div className="bg-white rounded-xl border border-slate-900/10 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-bold">Filters</div>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-bold underline"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Brand */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold">Brand</label>
                  <select
                    value={draftBrand}
                    onChange={(e) => {
                      const nextBrand = e.target.value;
                      setDraftBrand(nextBrand);
                      setDraftModel("");
                    }}
                    className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
                  >
                    <option value="">All</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold">Model</label>
                  <select
                    value={draftModel}
                    onChange={(e) => setDraftModel(e.target.value)}
                    disabled={modelDisabled}
                    className={
                      modelDisabled
                        ? "px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] opacity-50 cursor-not-allowed"
                        : "px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
                    }
                  >
                    <option value="">
                      {modelDisabled ? "Select brand first" : "All"}
                    </option>
                    {!modelDisabled &&
                      availableModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Fuel */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold">Fuel type</label>
                  <select
                    value={draftFuelType}
                    onChange={(e) => setDraftFuelType(e.target.value)}
                    className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
                  >
                    <option value="">All</option>
                    {fuelTypes.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 w-1/2">
                    <label className="text-xs font-bold">Min price</label>
                    <input
                      value={draftMinPrice}
                      onChange={(e) => setDraftMinPrice(e.target.value)}
                      placeholder="0"
                      inputMode="numeric"
                      className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-1/2">
                    <label className="text-xs font-bold">Max price</label>
                    <input
                      value={draftMaxPrice}
                      onChange={(e) => setDraftMaxPrice(e.target.value)}
                      placeholder="999"
                      inputMode="numeric"
                      className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                    />
                  </div>
                </div>

                {/* Availability */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold">Availability</label>
                  <select
                    value={draftAvailability}
                    onChange={(e) => setDraftAvailability(e.target.value as Availability)}
                    className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
                  >
                    <option value="ALL">All</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={applyFilters}
                  disabled={isLoading}
                  className="flex justify-center items-center px-4 rounded cursor-pointer bg-slate-900 w-full h-[30px] text-xs font-bold text-white disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Apply"}
                </button>
              </div>
            </div>
          </aside>

          {/* List */}
          <section className="flex-1">
            {/* Chips */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {appliedLabelChips.length === 0 ? (
                  <span className="text-xs text-slate-500">No filters applied.</span>
                ) : (
                  <>
                    {appliedLabelChips.map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={() => removeChip(chip.key)}
                        className="flex items-center gap-2 px-3 h-[30px] rounded-full border border-slate-900 text-xs font-bold"
                        title="Remove filter"
                      >
                        <span>{chip.label}</span>
                        <span className="text-sm leading-none">×</span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-xs font-bold underline ml-2"
                    >
                      Clear all
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-slate-700">
                {isLoading ? "Loading..." : `Showing ${cars.length} of ${totalLabel} cars`}
              </div>
              <div className="text-sm text-slate-700">
                Page {page}
                {totalPages !== null ? ` / ${totalPages}` : ""}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {!error && !isLoading && cars.length === 0 && (
              <p className="text-gray-500 text-sm">No cars available.</p>
            )}

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
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!canPrev}
                  className="px-3 h-[30px] text-xs font-bold rounded border border-slate-900 disabled:opacity-40"
                >
                  Prev
                </button>

                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!canNext}
                  className="px-3 h-[30px] text-xs font-bold rounded border border-slate-900 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};
