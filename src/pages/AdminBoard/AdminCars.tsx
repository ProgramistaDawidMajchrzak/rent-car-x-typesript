import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import schema, { CarFormData } from "./CarSchema";
import { createCar, getCars, updateCar, deleteCar } from "../../services/cars/service";

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

type SortField = "brand" | "model" | "year" | "pricePerDay";
type SortDirection = "asc" | "desc";

// odporne parsowanie odpowiedzi z API (bo swagger nie pokazuje schematu 200)
function parseCarsResponse(data: any): { items: Car[]; totalPages?: number; totalCount?: number } {
  if (Array.isArray(data)) {
    return { items: data };
  }

  const items: Car[] = data?.items ?? data?.data ?? data?.results ?? [];
  const totalPages: number | undefined = data?.totalPages ?? data?.pages;
  const totalCount: number | undefined = data?.totalCount ?? data?.totalItems ?? data?.count;

  return { items, totalPages, totalCount };
}

export const AdminCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  // sortowanie (na aktualnej stronie)
  const [sortField, setSortField] = useState<SortField>("brand");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // paginacja (server-side)
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // jeżeli backend zwraca totalPages/totalCount — wykorzystamy
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // filtry do GET /cars
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    fuelType: "",
    year: "" as string | number,
    isAvailable: "" as "" | "true" | "false",
    minPrice: "" as string | number,
    maxPrice: "" as string | number,
  });

  // edycja
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CarFormData>({
    resolver: yupResolver(schema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    watch: watchEdit,
    setValue: setValueEdit,
    formState: { errors: editErrors, isSubmitting: isSubmittingEdit },
  } = useForm<CarFormData>({
    resolver: yupResolver(schema),
  });

  const addBrand = watch("brand");
  const addModels = useMemo(() => (addBrand ? getModelsByBrand(addBrand) : []), [addBrand]);
  const addModelDisabled = !addBrand;

  const editBrand = watchEdit("brand");
  const editModels = useMemo(() => (editBrand ? getModelsByBrand(editBrand) : []), [editBrand]);
  const editModelDisabled = !editBrand;

  const loadCars = async () => {
    setServerError("");
    try {
      const params: any = {
        pageNumber,
        pageSize,
      };

      // filtry — dodajemy tylko gdy mają wartość
      if (filters.brand) params.brand = filters.brand;
      if (filters.model) params.model = filters.model;
      if (filters.fuelType) params.fuelType = filters.fuelType;
      if (filters.year !== "" && !Number.isNaN(Number(filters.year))) params.year = Number(filters.year);
      if (filters.minPrice !== "" && !Number.isNaN(Number(filters.minPrice))) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice !== "" && !Number.isNaN(Number(filters.maxPrice))) params.maxPrice = Number(filters.maxPrice);
      if (filters.isAvailable !== "") params.isAvailable = filters.isAvailable === "true";

      const data = await getCars(params);
      const parsed = parseCarsResponse(data);

      setCars(parsed.items);
      setTotalPages(parsed.totalPages ?? null);
      setTotalCount(parsed.totalCount ?? null);
    } catch (err) {
      console.error(err);
      setServerError(err instanceof Error ? err.message : "Failed to load cars.");
    }
  };

  useEffect(() => {
    loadCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize, filters]);

  // sortowanie na aktualnej stronie
  const sortedCars = useMemo(() => {
    const sorted = [...cars];
    sorted.sort((a, b) => {
      let aValue: string | number = (a as any)[sortField];
      let bValue: string | number = (b as any)[sortField];

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [cars, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortArrow = (field: SortField) =>
    sortField === field ? (sortDirection === "asc" ? " ↑" : " ↓") : "";

  // Create
  const onSubmit = async (data: CarFormData) => {
    setServerError("");
    setSuccess("");

    try {
      const { photo, ...carData } = data as any; // swagger = JSON → photo out
      await createCar(carData);
      setSuccess("Car created successfully!");
      reset();
      setPageNumber(1);
      await loadCars();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to create car.");
    }
  };

  // Edit start
  const startEdit = (car: Car) => {
    setEditingCar(car);
    setEditError("");
    setEditSuccess("");

    resetEdit({
      brand: car.brand,
      model: car.model,
      year: car.year,
      fuelType: car.fuelType,
      pricePerDay: car.pricePerDay,
      isAvailable: car.isAvailable,
    } as any);
  };

  const onSubmitEdit = async (data: CarFormData) => {
  if (!editingCar) return;

  setEditError("");
  setEditSuccess("");

  try {
    await updateCar(editingCar.id, {
      brand: data.brand,
      model: data.model,
      year: Number(data.year),
      fuelType: data.fuelType,
      pricePerDay: Number(data.pricePerDay),
      isAvailable: !!data.isAvailable,
    });

    setEditSuccess("Car updated successfully!");
    await loadCars();
    setTimeout(() => setEditingCar(null), 400);
  } catch (err) {
    setEditError(err instanceof Error ? err.message : "Failed to update car.");
  }
};


  // Delete
  const handleDelete = async (id: string) => {
    const sure = window.confirm("Are you sure you want to delete this car?");
    if (!sure) return;

    try {
      await deleteCar(id);
      await loadCars();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to delete car.");
    }
  };

  // paginacja: jeśli backend nie zwraca totalPages, to „Next” wyłączymy gdy przyszło mniej niż pageSize
  const canGoPrev = pageNumber > 1;
  const canGoNext =
    totalPages !== null ? pageNumber < totalPages : cars.length === pageSize;

  return (
    <AdminLayout title="Cars">
      <div className="flex gap-10 p-10">
        {/* LEWA – create + filtry */}
        <div className="w-[400px]">
          <h2 className="text-xl font-bold mb-4">Add New Car</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Brand */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold">Brand</label>
              <select
                {...register("brand")}
                onChange={(e) => {
                  const selected = e.target.value;
                  setValue("brand", selected as any);
                  setValue("model", "" as any);
                }}
                className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
              >
                <option value="">Select brand</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <p className="text-red-500 text-xs">{errors.brand?.message}</p>
            </div>

            {/* Model */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold">Model</label>
              <select
                {...register("model")}
                disabled={addModelDisabled}
                className={
                  addModelDisabled
                    ? "px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] opacity-50 cursor-not-allowed"
                    : "px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
                }
              >
                <option value="">
                  {addModelDisabled ? "Select brand first" : "Select model"}
                </option>
                {!addModelDisabled &&
                  addModels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
              </select>
              <p className="text-red-500 text-xs">{errors.model?.message}</p>
            </div>

            {/* Year */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold">Year</label>
              <input
                {...register("year")}
                placeholder="Enter year"
                type="number"
                className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
              />
              <p className="text-red-500 text-xs">{errors.year?.message}</p>
            </div>

            {/* Fuel */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold">Fuel Type</label>
              <select
                {...register("fuelType")}
                className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
              >
                <option value="">Select fuel type</option>
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <p className="text-red-500 text-xs">{errors.fuelType?.message}</p>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold">Price Per Day</label>
              <input
                {...register("pricePerDay")}
                placeholder="Enter price"
                type="number"
                className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
              />
              <p className="text-red-500 text-xs">{errors.pricePerDay?.message}</p>
            </div>

            {/* Availability */}
            <div className="flex flex-row items-center gap-2">
              <input type="checkbox" {...register("isAvailable")} />
              <label className="text-xs font-bold">Is Available</label>
            </div>

            {/* Photo (na razie tylko UI — swagger JSON) */}
            <div className="flex flex-row items-center gap-2">
              <input type="file" accept="image/*" {...register("photo" as any)} />
              <label className="text-xs font-bold">Photo</label>
              {/* <span className="text-[10px] text-gray-400">(API JSON – upload osobno)</span> */}
            </div>

            {serverError && <p className="text-red-500 text-xs">{serverError}</p>}
            {success && <p className="text-green-600 text-xs">{success}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center items-center px-4 rounded cursor-pointer bg-[#02193D] w-full h-[30px] text-xs font-bold text-white disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Add Car"}
            </button>
          </form>

          {/* FILTRY GET /cars
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-3">Filters</h3>

            <div className="flex flex-col gap-3 text-xs">
              <input
                value={filters.brand}
                onChange={(e) => setFilters((p) => ({ ...p, brand: e.target.value }))}
                placeholder="brand"
                className="px-2 w-full rounded-lg border border-slate-900/50 h-[30px]"
              />
              <input
                value={filters.model}
                onChange={(e) => setFilters((p) => ({ ...p, model: e.target.value }))}
                placeholder="model"
                className="px-2 w-full rounded-lg border border-slate-900/50 h-[30px]"
              />
              <input
                value={filters.fuelType}
                onChange={(e) => setFilters((p) => ({ ...p, fuelType: e.target.value }))}
                placeholder="fuelType"
                className="px-2 w-full rounded-lg border border-slate-900/50 h-[30px]"
              />
              <input
                value={filters.year as any}
                onChange={(e) => setFilters((p) => ({ ...p, year: e.target.value }))}
                placeholder="year"
                type="number"
                className="px-2 w-full rounded-lg border border-slate-900/50 h-[30px]"
              />
              <div className="flex gap-2">
                <input
                  value={filters.minPrice as any}
                  onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
                  placeholder="minPrice"
                  type="number"
                  className="px-2 w-1/2 rounded-lg border border-slate-900/50 h-[30px]"
                />
                <input
                  value={filters.maxPrice as any}
                  onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
                  placeholder="maxPrice"
                  type="number"
                  className="px-2 w-1/2 rounded-lg border border-slate-900/50 h-[30px]"
                />
              </div>

              <select
                value={filters.isAvailable}
                onChange={(e) => setFilters((p) => ({ ...p, isAvailable: e.target.value as any }))}
                className="px-2 w-full rounded-lg border border-slate-900/50 h-[30px]"
              >
                <option value="">isAvailable (any)</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>

              <button
                type="button"
                className="px-3 py-2 rounded border border-slate-300"
                onClick={() => {
                  setFilters({
                    brand: "",
                    model: "",
                    fuelType: "",
                    year: "",
                    isAvailable: "",
                    minPrice: "",
                    maxPrice: "",
                  });
                  setPageNumber(1);
                }}
              >
                Clear filters
              </button>

              <div className="flex items-center gap-2">
                <span>Page size:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageNumber(1);
                  }}
                  className="px-2 rounded border border-slate-300 h-[30px]"
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {totalCount !== null && (
                <div className="text-[11px] text-gray-500">
                  Total items: {totalCount}
                </div>
              )}
            </div>
          </div>*/}
        </div> 

        {/* PRAWA – lista aut */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Cars List</h2>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full text-xs">
              <thead className="bg-[#02193D] text-white">
                <tr>
                  <th className="py-2 px-3 text-left cursor-pointer" onClick={() => handleSort("brand")}>
                    Brand{sortArrow("brand")}
                  </th>
                  <th className="py-2 px-3 text-left cursor-pointer" onClick={() => handleSort("model")}>
                    Model{sortArrow("model")}
                  </th>
                  <th className="py-2 px-3 text-left">Photo</th>
                  <th className="py-2 px-3 text-left cursor-pointer" onClick={() => handleSort("year")}>
                    Year{sortArrow("year")}
                  </th>
                  <th className="py-2 px-3 text-left cursor-pointer" onClick={() => handleSort("pricePerDay")}>
                    Price / day{sortArrow("pricePerDay")}
                  </th>
                  <th className="py-2 px-3 text-left">Fuel</th>
                  <th className="py-2 px-3 text-left">Available</th>
                  <th className="py-2 px-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedCars.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-zinc-500">
                      No cars found.
                    </td>
                  </tr>
                )}

                {sortedCars.map((car) => (
                  <tr key={car.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-2 px-3">{car.brand}</td>
                    <td className="py-2 px-3">{car.model}</td>

                    <td className="px-3 py-2 text-xs text-gray-700">
                      {car.photoUrl ? (
                        <div className="w-20 h-14 flex items-center justify-center overflow-hidden">
                          <img
                            src={`http://localhost:8080${car.photoUrl}`}
                            alt={`${car.brand} ${car.model}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px]">No photo</span>
                      )}
                    </td>

                    <td className="py-2 px-3">{car.year}</td>
                    <td className="py-2 px-3">{car.pricePerDay.toFixed(2)} $</td>
                    <td className="py-2 px-3">{car.fuelType}</td>
                    <td className="py-2 px-3">
                      {car.isAvailable ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-red-500 font-semibold">No</span>
                      )}
                    </td>
                    <td className="py-2 px-3 flex gap-2">
                      <button
                        onClick={() => startEdit(car)}
                        className="px-2 py-1 text-[11px] rounded bg-[#02193D] text-white hover:opacity-80"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="px-2 py-1 text-[11px] rounded bg-red-600 text-white hover:opacity-80"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginacja server-side */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <div>
              Page {pageNumber}
              {totalPages !== null ? ` of ${totalPages}` : ""}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={!canGoPrev}
                className="px-3 py-1 rounded border border-slate-300 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={() => setPageNumber((p) => p + 1)}
                disabled={!canGoNext}
                className="px-3 py-1 rounded border border-slate-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDYCJI */}
      {editingCar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative">
            <button onClick={() => setEditingCar(null)} className="absolute top-2 right-3 text-slate-500 text-lg">
              ×
            </button>

            <h3 className="text-lg font-bold mb-4 text-[#02193D]">Edit Car</h3>

            <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="flex flex-col gap-3">
              {/* Brand */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Brand</label>
                <select
                  {...registerEdit("brand")}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setValueEdit("brand", selected, { shouldValidate: true, shouldDirty: true });
                    setValueEdit("model", "", { shouldValidate: true, shouldDirty: true });
                  }}

                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
                >
                  <option value="">Select brand</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <p className="text-red-500 text-xs">{editErrors.brand?.message}</p>
              </div>

              {/* Model */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Model</label>
                <select
                  {...registerEdit("model")}
                  disabled={editModelDisabled}
                  className={
                    editModelDisabled
                      ? "px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] opacity-50 cursor-not-allowed"
                      : "px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
                  }
                >
                  <option value="">
                    {editModelDisabled ? "Select brand first" : "Select model"}
                  </option>
                  {!editModelDisabled &&
                    editModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                </select>
                <p className="text-red-500 text-xs">{editErrors.model?.message}</p>
              </div>

              {/* Year */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Year</label>
                <input
                  type="number"
                  {...registerEdit("year")}
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">{editErrors.year?.message}</p>
              </div>

              {/* Fuel */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Fuel Type</label>
                <select
                  {...registerEdit("fuelType")}
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
                >
                  <option value="">Select fuel type</option>
                  {fuelTypes.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <p className="text-red-500 text-xs">{editErrors.fuelType?.message}</p>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Price Per Day</label>
                <input
                  type="number"
                  {...registerEdit("pricePerDay")}
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">{editErrors.pricePerDay?.message}</p>
              </div>

              {/* Available */}
              <div className="flex flex-row items-center gap-2">
                <input type="checkbox" {...registerEdit("isAvailable")} />
                <label className="text-xs font-bold">Is Available</label>
              </div>

              {editError && <p className="text-red-500 text-xs">{editError}</p>}
              {editSuccess && <p className="text-green-600 text-xs">{editSuccess}</p>}

              <button
                type="submit"
                disabled={isSubmittingEdit}
                className="mt-2 flex justify-center items-center px-4 rounded cursor-pointer bg-[#02193D] w-full h-[30px] text-xs font-bold text-white disabled:opacity-50"
              >
                {isSubmittingEdit ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
