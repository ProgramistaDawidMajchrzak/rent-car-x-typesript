import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ poprawne importy pod Twoją strukturę
import { createReservation } from "../../services/reservations/service";
import { getCarById } from "../../services/cars/service";

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

type FormValues = {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
};

const schema = yup.object().shape({
  startDate: yup.string().required("Start date is required"),
  endDate: yup
    .string()
    .required("End date is required")
    .test("is-after-start", "End date must be after start date", function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) > new Date(startDate);
    }),
});

function daysBetween(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  if (Number.isNaN(diff) || diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ✅ backend chce ISO datetime, a input daje YYYY-MM-DD
function dateToIso(dateYYYYMMDD: string) {
  // UTC midnight (bez offsetów lokalnych)
  return new Date(`${dateYYYYMMDD}T00:00:00.000Z`).toISOString();
}

function mapCarDetailsToCar(raw: any): Car {
  return {
    id: raw.id ?? raw.Id,
    brand: raw.brand ?? raw.Brand ?? "",
    model: raw.model ?? raw.Model ?? "",
    year: raw.year ?? raw.Year ?? 0,
    fuelType: raw.fuelType ?? raw.FuelType ?? "",
    pricePerDay: raw.pricePerDay ?? raw.PricePerDay ?? 0,
    isAvailable: Boolean(raw.isAvailable ?? raw.IsAvailable ?? raw.available ?? raw.Available),
    photoUrl: raw.photoUrl ?? raw.PhotoUrl ?? raw.imageUrl ?? raw.ImageUrl ?? raw.photo ?? null,
  };
}

function resolvePhotoUrl(photoUrl?: string | null) {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) return photoUrl;

  // ✅ tu ustaw swój backend base url
  // jeśli masz request baseURL = http://localhost:8080/api/v1, to zdjęcia zwykle są z hosta backendu
  return `http://localhost:8080${photoUrl}`;
}

export const ReservationPage: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const carFromState = (location.state as any)?.car as Car | undefined;

  const [car, setCar] = useState<Car | null>(carFromState ?? null);
  const [carError, setCarError] = useState("");
  const [loadingCar, setLoadingCar] = useState(false);

  const [serverError, setServerError] = useState("");
  const [ok, setOk] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return daysBetween(startDate, endDate);
  }, [startDate, endDate]);

  const pricePerDay = car?.pricePerDay ?? 0;
  const total = useMemo(() => days * pricePerDay, [days, pricePerDay]);

  useEffect(() => {
    if (!carId) return;

    // jeśli car przyszedł w state, nie musisz robić requestu (ale możemy dociągnąć szczegóły)
    setLoadingCar(true);
    setCarError("");

    getCarById(carId)
      .then((data) => {
        const mapped = mapCarDetailsToCar(data);
        setCar((prev) => {
          const photoUrl = mapped.photoUrl ?? prev?.photoUrl ?? null;
          return { ...(prev ?? mapped), ...mapped, photoUrl };
        });
      })
      .catch((e) => setCarError(e instanceof Error ? e.message : "Failed to load car."))
      .finally(() => setLoadingCar(false));
  }, [carId]);

  const onSubmit = async (data: FormValues) => {
    if (!carId) return;

    setServerError("");
    setOk("");

    try {
      // ✅ swagger: startDate/endDate jako ISO datetime
      const payload = {
        carId,
        startDate: dateToIso(data.startDate),
        endDate: dateToIso(data.endDate),
      };

      await createReservation(payload);

      setOk("Reservation created successfully!");
      setTimeout(() => navigate("/my-account"), 600);
    } catch (err: any) {
      setServerError(err?.message ?? "Failed to create reservation.");
      console.error(err);
    }
  };

  if (!carId) {
    return (
      <Layout>
        <div className="p-10">
          <p className="text-red-500 text-sm">Invalid car id.</p>
        </div>
      </Layout>
    );
  }

  const imgSrc = resolvePhotoUrl(car?.photoUrl);

  return (
    <Layout>
      <div className="px-6 lg:px-32 py-10">
        <div className="flex flex-col gap-2 mb-6">
          <button
            type="button"
            onClick={() => navigate("/car-list")}
            className="text-xs font-bold underline w-fit"
          >
            ← Back to cars
          </button>

          <h1 className="text-2xl font-bold text-[#02193D]">Finalize your reservation</h1>
          <p className="text-sm text-slate-600">
            Select dates and review your car details before confirming.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-md border border-slate-900/10 overflow-hidden">
              <div className="bg-slate-50 h-[280px] flex items-center justify-center">
                {loadingCar ? (
                  <div className="text-sm text-slate-500">Loading car...</div>
                ) : imgSrc ? (
                  <img src={imgSrc} alt="Car" className="w-80 max-h-full object-contain" />
                ) : (
                  <div className="text-xs text-gray-400">No photo</div>
                )}
              </div>

              <div className="p-6">
                {carError && <p className="text-red-500 text-sm mb-3">{carError}</p>}

                {!carError && car && (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xl font-bold text-slate-900">
                          {car.brand} {car.model}
                        </div>
                        <div className="text-sm text-slate-500 font-semibold">
                          {car.year} • {car.fuelType}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-900">
                          ${car.pricePerDay.toFixed(2)}
                          <span className="text-sm text-slate-400">/day</span>
                        </div>

                        <div
                          className={
                            "text-xs font-bold mt-1 px-3 py-1 rounded-full inline-block " +
                            (car.isAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600")
                          }
                        >
                          {car.isAvailable ? "Available" : "Unavailable"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-900/10">
                        <div className="text-xs font-bold text-slate-900">No hidden fees</div>
                        <div className="text-xs text-slate-500">Clear pricing & taxes</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-900/10">
                        <div className="text-xs font-bold text-slate-900">Free cancellation</div>
                        <div className="text-xs text-slate-500">Up to 24h before</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-900/10">
                        <div className="text-xs font-bold text-slate-900">Support</div>
                        <div className="text-xs text-slate-500">24/7 assistance</div>
                      </div>
                    </div>
                  </>
                )}

                {!loadingCar && !carError && !car && (
                  <p className="text-sm text-slate-500">Car not found.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-900/10">
              <div className="text-lg font-bold text-slate-900 mb-1">Choose your dates</div>
              <p className="text-xs text-slate-500 mb-6">
                Reservation for car ID: <span className="font-mono">{carId}</span>
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold">Start date</label>
                  <input
                    type="date"
                    min={todayISO()}
                    {...register("startDate")}
                    className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-700"
                  />
                  <p className="text-red-500 text-xs">{errors.startDate?.message}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold">End date</label>
                  <input
                    type="date"
                    min={startDate || todayISO()}
                    {...register("endDate")}
                    className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-700"
                  />
                  <p className="text-red-500 text-xs">{errors.endDate?.message}</p>
                </div>

                <div className="mt-2 rounded-xl border border-slate-900/10 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Days</span>
                    <span className="font-bold text-slate-900">{days || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-600">Price / day</span>
                    <span className="font-bold text-slate-900">${pricePerDay.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-slate-900/10 my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Total</span>
                    <span className="text-lg font-bold text-slate-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                {serverError && <p className="text-red-600 text-xs font-medium">{serverError}</p>}
                {ok && <p className="text-green-700 text-xs font-medium">{ok}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting || loadingCar || !car || !car.isAvailable || days <= 0}
                  className="mt-3 flex justify-center items-center px-4 rounded cursor-pointer bg-[#02193D] w-full h-[34px] text-xs font-bold text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Confirm reservation"}
                </button>

                {!loadingCar && car && !car.isAvailable && (
                  <p className="text-xs text-red-600">
                    This car is currently unavailable. Please choose another car.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
