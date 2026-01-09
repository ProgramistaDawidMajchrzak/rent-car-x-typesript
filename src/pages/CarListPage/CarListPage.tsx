import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout/Layout";
import { CarRentalHeroCompact } from "../Home/components/CarRentalHeroCompact";
import { CarCard } from "../../components/Cars/CarCard";
import { getCars } from "../../services/cars.service";

import { brands, fuelTypes, getModelsByBrand } from "../../helpers/carSchema";


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

const PAGE_SIZE = 16;

/** Debounce helper (przyda się też później jeśli wrócą inputy) */
function useDebouncedCallback(callback: () => void, delayMs: number) {
  const timeoutRef = useRef<number | null>(null);

  return () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      callback();
    }, delayMs);
  };
}

// Sztywne marki + modele (3 najpopularniejsze per marka – przykładowe)
// const BRAND_OPTIONS = ["Audi", "BMW", "Volkswagen", "Skoda", "Toyota", "Mazda", "Volvo"] as const;

// const MODELS_BY_BRAND: Record<(typeof BRAND_OPTIONS)[number], string[]> = {
//   Audi: ["A3", "A4", "Q5"],
//   BMW: ["3 Series", "5 Series", "X5"],
//   Volkswagen: ["Golf", "Passat", "Tiguan"],
//   Skoda: ["Octavia", "Superb", "Kodiaq"],
//   Toyota: ["Corolla", "Yaris", "RAV4"],
//   Mazda: ["Mazda 3", "CX-5", "MX-5"],
//   Volvo: ["XC60", "XC90", "S60"],
// };

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

export const CarListPage: React.FC = () => {
  const navigate = useNavigate();

  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ------- UI state (draft) - edytujesz w panelu filtrów, ale nie odpala requestu
  const [draftBrand, setDraftBrand] = useState<string>("");
  const [draftModel, setDraftModel] = useState<string>("");
  const [draftFuelType, setDraftFuelType] = useState<string>("");
  const [draftMinPrice, setDraftMinPrice] = useState<string>("");
  const [draftMaxPrice, setDraftMaxPrice] = useState<string>("");
  const [draftAvailability, setDraftAvailability] = useState<Availability>("ALL");

  // ------- Applied filters - dopiero to idzie do API
  const [applied, setApplied] = useState<Filters>(emptyFilters);

  // ------- Paginacja
  const [page, setPage] = useState(1);

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

  const availableModels = useMemo(() => {
    if (!draftBrand) return [];
    return getModelsByBrand(draftBrand);
  }, [draftBrand]);

  const modelDisabled = !draftBrand;

  const total = cars.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageCars = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return cars.slice(start, start + PAGE_SIZE);
  }, [cars, page]);

  const loadCars = async (filters: Filters) => {
    setError("");
    setIsLoading(true);

    try {
      const data = await getCars({
        brand: filters.brand,
        model: filters.model,
        fuelType: filters.fuelType,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        isAvailable: filters.isAvailable,
      });

      setCars(data);
      setPage(1);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Unable to load cars.");
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Na start: pobierz wszystko
  useEffect(() => {
    loadCars(emptyFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce apply (po to, żeby szybkie kliki nie robiły 10 requestów)
  const debouncedApply = useDebouncedCallback(() => {
    loadCars(applied);
  }, 250);

  // Apply: przepisujemy draft -> applied i robimy request (debounced)
  const applyFilters = () => {
    const nextApplied: Filters = {
      brand: draftBrand.trim() ? draftBrand.trim() : null,
      model: draftModel.trim() ? draftModel.trim() : null,
      fuelType: draftFuelType.trim() ? draftFuelType.trim() : null,
      minPrice: draftMinPrice.trim() ? draftMinPrice.trim() : null,
      maxPrice: draftMaxPrice.trim() ? draftMaxPrice.trim() : null,
      isAvailable:
        draftAvailability === "ALL" ? null : draftAvailability === "AVAILABLE" ? true : false,
    };

    setApplied(nextApplied);
    loadCars(nextApplied);
  };

  const clearAll = () => {
    setDraftBrand("");
    setDraftModel("");
    setDraftFuelType("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setDraftAvailability("ALL");
    setApplied(emptyFilters);
    loadCars(emptyFilters);
  };

  const removeChip = (key: keyof Filters) => {
    const next: Filters = { ...applied, [key]: null };

    // zależność: jeśli usuwasz brand, usuń też model
    if (key === "brand") next.model = null;

    setApplied(next);
    loadCars(next);

    // zsynchronizuj draft, żeby UI w panelu też się zgadzał
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
                {/* Brand select */}
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
                      <option key={b} value={b}>{b}</option>
                    ))}

                  </select>
                </div>

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
                    <option value="">{modelDisabled ? "Select brand first" : "All"}</option>
                    {!modelDisabled &&
                      availableModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold">Fuel type</label>
                  <select
                    value={draftFuelType}
                    onChange={(e) => setDraftFuelType(e.target.value)}
                    className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
                  >
                    {fuelTypes.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

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
                {isLoading ? "Loading..." : `Showing ${total} cars`}
              </div>
              <div className="text-sm text-slate-700">
                Page {page} / {totalPages}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {!error && !isLoading && total === 0 && (
              <p className="text-gray-500 text-sm">No cars available.</p>
            )}

            <div className="flex flex-wrap gap-4">
              {pageCars.map((car) => (
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
                  onRent={() => navigate(`/reservation/${car.id}`, { state: { car } })}
                />
              ))}
            </div>

            {/* Pagination */}
            {total > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 h-[30px] text-xs font-bold rounded border border-slate-900 disabled:opacity-40"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }).slice(0, 12).map((_, idx) => {
                  const p = idx + 1;
                  const active = p === page;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={
                        active
                          ? "px-3 h-[30px] text-xs font-bold rounded bg-slate-900 text-white"
                          : "px-3 h-[30px] text-xs font-bold rounded border border-slate-900"
                      }
                    >
                      {p}
                    </button>
                  );
                })}

                {totalPages > 12 && <span className="text-xs font-bold px-2">…</span>}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
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
