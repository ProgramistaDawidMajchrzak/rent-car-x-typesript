import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import schema, { CarFormData } from "./CarSchema";
import { createCar, getCars, updateCar, deleteCar } from "../../services/cars/service";

import { brands, fuelTypes, getModelsByBrand } from "../../helpers/carSchema";
import { buildImageUrl } from "../../helpers/imageUrl";

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

type SortField = "brand" | "model" | "year" | "pricePerDay";
type SortDirection = "asc" | "desc";

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

  const [sortField, setSortField] = useState<SortField>("brand");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    fuelType: "",
    year: "" as string | number,
    isAvailable: "" as "" | "true" | "false",
    minPrice: "" as string | number,
    maxPrice: "" as string | number,
  });

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
  }, [pageNumber, pageSize, filters]);

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

  const onSubmit = async (data: CarFormData) => {
  setServerError("");
  setSuccess("");

  try {
    const photoFile =
      data.photo && (data.photo as any).length > 0 ? (data.photo as any)[0] : undefined;

    await createCar(data, photoFile);

    setSuccess("Car created successfully!");
    reset();
    setPageNumber(1);
    await loadCars();
  } catch (err) {
    setServerError(err instanceof Error ? err.message : "Failed to create car.");
  }
};


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
      const photoFile = data.photo && (data.photo as any).length > 0 
        ? (data.photo as any)[0] 
        : undefined;

      await updateCar(editingCar.id, data, photoFile);

      setEditSuccess("Car updated successfully!");
      await loadCars();
      setTimeout(() => setEditingCar(null), 1000);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Update failed.");
    }
  };


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

  const canGoPrev = pageNumber > 1;
  const canGoNext =
    totalPages !== null ? pageNumber < totalPages : cars.length === pageSize;

  return (
    <AdminLayout title="Cars">
      <div className="flex gap-10 p-10">
        <div className="w-[400px]">
          <h2 className="text-xl font-bold mb-4">Add New Car</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

     
            <div className="flex flex-row items-center gap-2">
              <input type="checkbox" {...register("isAvailable")} />
              <label className="text-xs font-bold">Is Available</label>
            </div>

        
            <div className="flex flex-row items-center gap-2">
              <input type="file" accept="image/*" {...register("photo" as any)} />
              <label className="text-xs font-bold">Photo</label>
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
        </div> 

  
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
                      {car.imageUrl ? (
                        <div className="w-20 h-14 flex items-center justify-center overflow-hidden">
                          <img
                            src={buildImageUrl(car.imageUrl)!}
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

      {editingCar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative">
            <button onClick={() => setEditingCar(null)} className="absolute top-2 right-3 text-slate-500 text-lg">
              ×
            </button>

            <h3 className="text-lg font-bold mb-4 text-[#02193D]">Edit Car</h3>

            <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="flex flex-col gap-3">

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

      
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Year</label>
                <input
                  type="number"
                  {...registerEdit("year")}
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">{editErrors.year?.message}</p>
              </div>

 
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

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Price Per Day</label>
                <input
                  type="number"
                  {...registerEdit("pricePerDay")}
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">{editErrors.pricePerDay?.message}</p>
              </div>

          
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
