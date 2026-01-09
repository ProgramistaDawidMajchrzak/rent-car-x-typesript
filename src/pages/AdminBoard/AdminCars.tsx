import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import schema, { CarFormData } from "./CarSchema";
import { createCar, getCarsHome, updateCar, deleteCar } from "../../services/cars.service";

import { brands, fuelTypes, getModelsByBrand } from "../../helpers/carSchema";

type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  pricePerDay: number;
  isAvailable: boolean;
  photoUrl?: string | null; // z backendu
};

type SortField = "brand" | "model" | "year" | "pricePerDay";
type SortDirection = "asc" | "desc";

export const AdminCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  // sortowanie
  const [sortField, setSortField] = useState<SortField>("brand");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // paginacja
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // edycja (modal)
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

 const {
  register,
  handleSubmit,
  reset,
  watch,
  formState: { errors, isSubmitting },
} = useForm<CarFormData>({
  resolver: yupResolver(schema),
});



 const {
  register: registerEdit,
  handleSubmit: handleSubmitEdit,
  reset: resetEdit,
  watch: watchEdit,
  formState: { errors: editErrors, isSubmitting: isSubmittingEdit },
} = useForm<CarFormData>({
  resolver: yupResolver(schema),
});

const addBrand = watch("brand");
const addModels = useMemo(
  () => (addBrand ? getModelsByBrand(addBrand) : []),
  [addBrand]
);
const addModelDisabled = !addBrand;

const editBrand = watchEdit("brand");
const editModels = useMemo(
  () => (editBrand ? getModelsByBrand(editBrand) : []),
  [editBrand]
);
const editModelDisabled = !editBrand;



  // pobranie listy aut
  const loadCars = async () => {
    try {
      const data = await getCarsHome();
      setCars(data);
    //   console.log(data)
    } catch (err) {
      console.error(err);
      setServerError(
        err instanceof Error ? err.message : "Failed to load cars."
      );
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  // submit dodawania
  const onSubmit = async (data: CarFormData) => {
    setServerError("");
    setSuccess("");

    try {
        console.log(data)
      await createCar(data);
      setSuccess("Car created successfully!");
      reset();
      await loadCars();
    } catch (err) {
      if (err instanceof Error) setServerError(err.message);
      else setServerError("Failed to create car.");
    }
  };

  // zmiana sortowania po kliknięciu w nagłówek
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // posortowane auta
  const sortedCars = useMemo(() => {
    const sorted = [...cars];
    sorted.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [cars, sortField, sortDirection]);

  // paginacja
  const totalPages = Math.max(1, Math.ceil(sortedCars.length / pageSize));
  const pagedCars = sortedCars.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // start edycji
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
    });
  };

  // submit edycji
  const onSubmitEdit = async (data: CarFormData) => {
    if (!editingCar) return;
    setEditError("");
    setEditSuccess("");

    try {
      await updateCar(editingCar.id, data);
      setEditSuccess("Car updated successfully!");
      await loadCars();
      // zamknij modal po udanej edycji
      setTimeout(() => {
        setEditingCar(null);
      }, 500);
    } catch (err) {
      if (err instanceof Error) setEditError(err.message);
      else setEditError("Failed to update car.");
    }
  };

  // kasowanie
  const handleDelete = async (id: string) => {
    const sure = window.confirm("Are you sure you want to delete this car?");
    if (!sure) return;

    try {
      await deleteCar(id);
      await loadCars();
    } catch (err) {
      console.error(err);
      alert(
        err instanceof Error ? err.message : "Failed to delete car."
      );
    }
  };

  

  // helper do strzałki sortowania
  const sortArrow = (field: SortField) =>
    sortField === field ? (sortDirection === "asc" ? " ↑" : " ↓") : "";

  return (
    <AdminLayout title="Cars">
      <div className="flex gap-10 p-10">
        {/* LEWA KOLUMNA – formularz dodawania */}
        <div className="w-[400px]">
          <h2 className="text-xl font-bold mb-4">Add New Car</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4"> 
            {/* tutaj error */}
            {/* Brand */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold">Brand</label>
              <div className="flex flex-col gap-1">
              {/* <label className="text-xs font-bold">Brand</label> */}
              <select
                {...register("brand")}
                onChange={(e) => {
                  // reset model kiedy zmieni się marka
                  const selected = e.target.value;
                  // react-hook-form: trzeba ręcznie ustawić model na ""
                  // najprościej: reset częściowy
                  reset((prev) => ({ ...prev, brand: selected, model: "" }));
                }}
                className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
              >
                <option value="">Select brand</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <p className="text-red-500 text-xs">{errors.brand?.message}</p>
            </div>

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
              <option value="">{addModelDisabled ? "Select brand first" : "Select model"}</option>
              {!addModelDisabled &&
                addModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
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

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold">Fuel Type</label>
              <select
                {...register("fuelType")}
                className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px]"
              >
                <option value="">Select fuel type</option>
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>{f}</option>
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
              <p className="text-red-500 text-xs">
                {errors.pricePerDay?.message}
              </p>
            </div>

            {/* Availability */}
            <div className="flex flex-row items-center gap-2">
              <input type="checkbox" {...register("isAvailable")} />
              <label className="text-xs font-bold">Is Available</label>
            </div>
            <div className="flex flex-row items-center gap-2">
              <input
                type="file"
                accept="image/*"
                {...register("photo")}
                />
              <label className="text-xs font-bold">Photo</label>
            </div>

            {/* Server errors */}
            {serverError && (
              <p className="text-red-500 text-xs">{serverError}</p>
            )}

            {/* Success message */}
            {success && (
              <p className="text-green-600 text-xs">{success}</p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center items-center px-4 rounded cursor-pointer bg-[#02193D] w-full h-[30px] text-xs font-bold text-white disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Add Car"}
            </button>
          </form>
        </div>

        {/* PRAWA KOLUMNA – lista aut */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Cars List</h2>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full text-xs">
              <thead className="bg-[#02193D] text-white">
                <tr>
                  <th
                    className="py-2 px-3 text-left cursor-pointer"
                    onClick={() => handleSort("brand")}
                  >
                    Brand{sortArrow("brand")}
                  </th>
                  <th
                    className="py-2 px-3 text-left cursor-pointer"
                    onClick={() => handleSort("model")}
                  >
                    Model{sortArrow("model")}
                  </th>
                  <th className="py-2 px-3 text-left">Photo</th>
                  <th
                    className="py-2 px-3 text-left cursor-pointer"
                    onClick={() => handleSort("year")}
                  >
                    Year{sortArrow("year")}
                  </th>
                  <th
                    className="py-2 px-3 text-left cursor-pointer"
                    onClick={() => handleSort("pricePerDay")}
                  >
                    Price / day{sortArrow("pricePerDay")}
                  </th>
                  <th className="py-2 px-3 text-left">Fuel</th>
                  <th className="py-2 px-3 text-left">Available</th>
                  <th className="py-2 px-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedCars.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-4 text-zinc-500"
                    >
                      No cars found.
                    </td>
                  </tr>
                )}

                {pagedCars.map((car) => (
                  <tr
                    key={car.id}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="py-2 px-3">{car.brand}</td>
                    <td className="py-2 px-3">{car.model}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">
                      {car.photoUrl ? (
                        <div className="w-20 h-14 flex items-center justify-center overflow-hidden">
                          <img
                            src={`http://localhost:5113${car.photoUrl}`}
                            alt={`${car.brand} ${car.model}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px]">No photo</span>
                      )}
                    </td>

                    <td className="py-2 px-3">{car.year}</td>
                    <td className="py-2 px-3">
                      {car.pricePerDay.toFixed(2)} $
                    </td>
                    <td className="py-2 px-3">{car.fuelType}</td>
                    <td className="py-2 px-3">
                      {car.isAvailable ? (
                        <span className="text-green-600 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          No
                        </span>
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

          {/* Paginacja */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <div>
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-slate-300 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
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
            <button
              onClick={() => setEditingCar(null)}
              className="absolute top-2 right-3 text-slate-500 text-lg"
            >
              ×
            </button>

            <h3 className="text-lg font-bold mb-4 text-[#02193D]">
              Edit Car
            </h3>

            <form
              onSubmit={handleSubmitEdit(onSubmitEdit)} //   tutaj error
              className="flex flex-col gap-3"
            >
              {/* Brand */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Brand</label>
                <input
                  {...registerEdit("brand")}
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">
                  {editErrors.brand?.message}
                </p>
              </div>

              {/* Model */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Model</label>
                <input
                  {...registerEdit("model")}
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">
                  {editErrors.model?.message}
                </p>
              </div>

              {/* Year */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Year</label>
                <input
                  type="number"
                  {...registerEdit("year")}
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">
                  {editErrors.year?.message}
                </p>
              </div>

              {/* Fuel */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Fuel Type</label>
                <input
                  {...registerEdit("fuelType")}
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">
                  {editErrors.fuelType?.message}
                </p>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Price Per Day</label>
                <input
                  type="number"
                  {...registerEdit("pricePerDay")}
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">
                  {editErrors.pricePerDay?.message}
                </p>
              </div>

              {/* Available */}
              <div className="flex flex-row items-center gap-2">
                <input type="checkbox" {...registerEdit("isAvailable")} />
                <label className="text-xs font-bold">Is Available</label>
              </div>

              {editError && (
                <p className="text-red-500 text-xs">{editError}</p>
              )}
              {editSuccess && (
                <p className="text-green-600 text-xs">{editSuccess}</p>
              )}

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
