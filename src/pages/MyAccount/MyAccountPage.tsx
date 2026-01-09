import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout/Layout";
import {
  getMyReservations,
  deleteReservation,
  payReservation,
} from "../../services/reservation.service";

type Reservation = {
  id: string;
  carId: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalCost: number;

  // jeśli backend kiedyś doda:
  isPaid?: boolean;
};

function fmtDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString();
}

function daysBetween(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  if (Number.isNaN(diff) || diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const MyAccountPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // UX: blokuj przyciski w trakcie akcji na konkretnej rezerwacji
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadReservations = async () => {
    setError("");
    setIsLoading(true);
    try {
      const data = await getMyReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to load reservations.");
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const stats = useMemo(() => {
    const count = reservations.length;
    const totalSpend = reservations.reduce((sum, r) => sum + (r.totalCost ?? 0), 0);
    return { count, totalSpend };
  }, [reservations]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Cancel this reservation?")) return;

    setBusyId(id);
    try {
      await deleteReservation(id);
      await loadReservations();
    } catch (err) {
      alert("Failed to cancel reservation.");
    } finally {
      setBusyId(null);
    }
  };

  const handlePay = async (id: string) => {
    setBusyId(id);
    try {
      const checkoutUrl = await payReservation(id);
      window.location.href = checkoutUrl;
    } catch (err) {
      alert("Payment failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Layout>
      <div className="px-6 lg:px-32 py-10">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="text-3xl font-bold text-slate-900">My Reservations</div>
          <div className="text-sm text-slate-600">
            Manage your bookings, payments and cancellations.
          </div>
        </div>

        {/* Summary bar */}
        <div className="bg-white rounded-xl border border-slate-900/10 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
                {stats.count}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {stats.count === 1 ? "1 reservation" : `${stats.count} reservations`}
                </div>
                <div className="text-xs text-slate-500">
                  Total spend: <span className="font-semibold">${stats.totalSpend.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <a
              href="/car-list"
              className="inline-flex items-center justify-center px-4 h-[34px] rounded-lg bg-[#02193D] text-white text-xs font-bold hover:opacity-95"
            >
              Explore cars
            </a>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-red-700 text-sm font-semibold">{error}</p>
            <button
              onClick={loadReservations}
              className="mt-2 text-xs font-bold underline text-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-900/10 shadow-sm p-4"
              >
                <div className="h-5 w-40 bg-slate-200 rounded mb-3 animate-pulse" />
                <div className="h-4 w-56 bg-slate-200 rounded mb-2 animate-pulse" />
                <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                <div className="mt-4 flex gap-2">
                  <div className="h-[34px] w-28 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="h-[34px] w-28 bg-slate-200 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && reservations.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-900/10 shadow-sm p-8 text-center">
            <div className="text-xl font-bold text-slate-900 mb-2">No reservations yet</div>
            <div className="text-sm text-slate-600 mb-6">
              Choose a car and book your first rental in a few clicks.
            </div>
            <a
              href="/car-list"
              className="inline-flex items-center justify-center px-6 h-[38px] rounded-lg bg-slate-900 text-white text-xs font-bold"
            >
              Browse cars
            </a>
          </div>
        )}

        {/* List */}
        {!isLoading && reservations.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {reservations.map((r) => {
              const days = daysBetween(r.startDate, r.endDate);
              const paid = Boolean(r.isPaid); // jak backend nie zwraca, będzie false
              const isBusy = busyId === r.id;

              return (
                <div
                  key={r.id}
                  className="bg-white rounded-xl border border-slate-900/10 shadow-sm overflow-hidden"
                >
                  {/* top strip */}
                  <div className="px-5 py-4 border-b border-slate-900/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-900/10 flex items-center justify-center font-bold text-slate-900">
                        {r.carName?.slice(0, 1)?.toUpperCase() ?? "C"}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-lg font-bold text-slate-900">
                            {r.carName}
                          </div>

                          <span
                            className={
                              "text-[11px] font-bold px-3 py-1 rounded-full border " +
                              (paid
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-amber-50 text-amber-800 border-amber-200")
                            }
                          >
                            {paid ? "PAID" : "UNPAID"}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 mt-1">
                          {fmtDate(r.startDate)} → {fmtDate(r.endDate)}{" "}
                          <span className="mx-1">•</span>{" "}
                          <span className="font-semibold text-slate-700">
                            {days} {days === 1 ? "day" : "days"}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1">
                          Reservation ID: <span className="font-mono">{r.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-slate-500">Total</div>
                      <div className="text-2xl font-bold text-slate-900">
                        ${Number(r.totalCost ?? 0).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-xs text-slate-600">
                      Need changes? You can cancel the reservation anytime.
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <button
                        onClick={() => handlePay(r.id)}
                        disabled={isBusy /* || paid */}
                        className={
                          "px-4 h-[34px] rounded-lg text-xs font-bold " +
                          (isBusy
                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-green-600 text-white hover:opacity-95")
                        }
                      >
                        {isBusy ? "Working..." : "Pay now"}
                      </button>

                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={isBusy}
                        className={
                          "px-4 h-[34px] rounded-lg text-xs font-bold border " +
                          (isBusy
                            ? "border-slate-200 text-slate-400 cursor-not-allowed"
                            : "border-red-300 text-red-700 hover:bg-red-50")
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};
