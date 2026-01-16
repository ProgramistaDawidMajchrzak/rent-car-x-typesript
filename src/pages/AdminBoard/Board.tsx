import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  getUnavailableCars,
  getPendingReservations,
  getCarsStatuses,
  getReservationsDeadlineToday,
  getSystemLockedIds,
} from "../../services/admin/monitor.service";

type ActiveReservation = {
  id: string;
  startDate: string;
  endDate: string;
};

type UnavailableCar = {
  id: string;
  name: string;
  isAvailable: boolean;
  activeReservations: ActiveReservation[];
};

type CarDto = {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  pricePerDay: number;
  isAvailable: boolean;
  stripeProductId?: string | null;
  stripePriceId?: string | null;
};

type UserDto = {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  isDeleted: boolean;
};

type PendingReservation = {
  id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  isPaid: boolean;
  isDeleted: boolean;
  car?: CarDto | null;
  user?: UserDto | null;
};

type LoadState<T> = {
  data: T;
  loading: boolean;
  error: string;
};

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const copy = async (txt: string) => {
  try {
    await navigator.clipboard.writeText(txt);
  } catch {

    const el = document.createElement("textarea");
    el.value = txt;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
};

const Card: React.FC<{
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}> = ({ title, value, subtitle, loading, error, onRefresh }) => (
  <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-4 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div className="text-xs font-bold text-slate-700">{title}</div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="text-[11px] px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
        >
          Refresh
        </button>
      )}
    </div>

    <div className="text-2xl font-bold text-[#02193D]">{loading ? "…" : value}</div>
    {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
    {error && <div className="text-xs text-red-600 font-medium break-words">{error}</div>}
  </div>
);

export const Board: React.FC = () => {
  const [unavailable, setUnavailable] = useState<LoadState<UnavailableCar[]>>({
    data: [],
    loading: true,
    error: "",
  });

  const [pending, setPending] = useState<LoadState<PendingReservation[]>>({
    data: [],
    loading: true,
    error: "",
  });

  const [carsStatuses, setCarsStatuses] = useState<LoadState<any>>({
    data: null,
    loading: true,
    error: "",
  });

  const [deadlineToday, setDeadlineToday] = useState<LoadState<any>>({
    data: null,
    loading: true,
    error: "",
  });

  const [systemLocks, setSystemLocks] = useState<LoadState<any>>({
    data: null,
    loading: true,
    error: "",
  });

  const loadAll = async () => {
    setUnavailable((s) => ({ ...s, loading: true, error: "" }));
    setPending((s) => ({ ...s, loading: true, error: "" }));
    setCarsStatuses((s) => ({ ...s, loading: true, error: "" }));
    setDeadlineToday((s) => ({ ...s, loading: true, error: "" }));
    setSystemLocks((s) => ({ ...s, loading: true, error: "" }));

    await Promise.allSettled([
      (async () => {
        try {
          const data = (await getUnavailableCars()) as UnavailableCar[];
          setUnavailable({ data, loading: false, error: "" });
        } catch (e: any) {
          setUnavailable({ data: [], loading: false, error: e?.message ?? "Failed." });
        }
      })(),
      (async () => {
        try {
          const data = (await getPendingReservations()) as PendingReservation[];
          setPending({ data, loading: false, error: "" });
        } catch (e: any) {
          setPending({ data: [], loading: false, error: e?.message ?? "Failed." });
        }
      })(),
      (async () => {
        try {
          const data = await getCarsStatuses();
          setCarsStatuses({ data, loading: false, error: "" });
        } catch (e: any) {
          setCarsStatuses({ data: null, loading: false, error: e?.message ?? "Failed." });
        }
      })(),
      (async () => {
        try {
          const data = await getReservationsDeadlineToday();
          setDeadlineToday({ data, loading: false, error: "" });
        } catch (e: any) {
          setDeadlineToday({ data: null, loading: false, error: e?.message ?? "Failed." });
        }
      })(),
      (async () => {
        try {
          const data = await getSystemLockedIds();
          setSystemLocks({ data, loading: false, error: "" });
        } catch (e: any) {
          setSystemLocks({ data: null, loading: false, error: e?.message ?? "Failed." });
        }
      })(),
    ]);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const unavailableCount = unavailable.data.length;
  const pendingCount = pending.data.length;

  const pendingPaidCount = useMemo(
    () => pending.data.filter((p) => p.isPaid && !p.isDeleted).length,
    [pending.data]
  );

  const pendingUnpaidCount = useMemo(
    () => pending.data.filter((p) => !p.isPaid && !p.isDeleted).length,
    [pending.data]
  );

  return (
    <AdminLayout title="Dashboard">
      <div className="p-10">
  
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <div className="text-xl font-bold text-[#02193D]">System overview</div>
            <div className="text-xs text-slate-500">Monitoring & operational alerts</div>
          </div>

          <button
            onClick={loadAll}
            className="px-4 h-[32px] rounded bg-[#02193D] text-white text-xs font-bold hover:opacity-90"
          >
            Refresh all
          </button>
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <Card
            title="Unavailable cars"
            value={unavailableCount}
            subtitle="Cars currently not available"
            loading={unavailable.loading}
            error={unavailable.error}
          />

          <Card
            title="Pending reservations"
            value={pendingCount}
            subtitle={`Paid: ${pendingPaidCount} • Unpaid: ${pendingUnpaidCount}`}
            loading={pending.loading}
            error={pending.error}
          />

    
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <div className="bg-[#02193D] text-white px-4 py-2 text-xs font-bold">
              Pending reservations
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2">Reservation</th>
                    <th className="text-left px-3 py-2">Car</th>
                    <th className="text-left px-3 py-2">User</th>
                    <th className="text-left px-3 py-2">Dates</th>
                    <th className="text-left px-3 py-2">Cost</th>
                    <th className="text-left px-3 py-2">Status</th>
                    <th className="text-left px-3 py-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pending.loading && (
                    <tr>
                      <td className="px-3 py-3 text-slate-500" colSpan={7}>
                        Loading…
                      </td>
                    </tr>
                  )}

                  {!pending.loading && pending.error && (
                    <tr>
                      <td className="px-3 py-3 text-red-600" colSpan={7}>
                        {pending.error}
                      </td>
                    </tr>
                  )}

                  {!pending.loading && !pending.error && pending.data.length === 0 && (
                    <tr>
                      <td className="px-3 py-3 text-slate-500" colSpan={7}>
                        No pending reservations.
                      </td>
                    </tr>
                  )}

                  {!pending.loading &&
                    !pending.error &&
                    pending.data.slice(0, 10).map((r) => (
                      <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-3 py-2">
                          <div className="font-medium">{r.id.slice(0, 8)}…</div>
                          <div className="text-[11px] text-slate-500">CarId: {r.carId.slice(0, 8)}…</div>
                        </td>

                        <td className="px-3 py-2">
                          {r.car ? (
                            <>
                              <div className="font-medium">
                                {r.car.brand} {r.car.model}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {r.car.year} • {r.car.fuelType}
                              </div>
                            </>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="px-3 py-2">
                          {r.user ? (
                            <>
                              <div className="font-medium">{r.user.userName}</div>
                              <div className="text-[11px] text-slate-500">{r.user.email}</div>
                            </>
                          ) : (
                            <span className="text-slate-400">{r.userId.slice(0, 8)}…</span>
                          )}
                        </td>

                        <td className="px-3 py-2">
                          <div className="text-[11px]">{fmtDate(r.startDate)}</div>
                          <div className="text-[11px] text-slate-500">{fmtDate(r.endDate)}</div>
                        </td>

                        <td className="px-3 py-2">{Number(r.totalCost ?? 0).toFixed(2)}</td>

                        <td className="px-3 py-2">
                          <span
                            className={
                              r.isDeleted
                                ? "text-[11px] px-2 py-1 rounded bg-red-50 text-red-700 border border-red-100"
                                : r.isPaid
                                ? "text-[11px] px-2 py-1 rounded bg-green-50 text-green-700 border border-green-100"
                                : "text-[11px] px-2 py-1 rounded bg-yellow-50 text-yellow-700 border border-yellow-100"
                            }
                          >
                            {r.isDeleted ? "Deleted" : r.isPaid ? "Paid" : "Unpaid"}
                          </span>
                        </td>

                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => copy(r.id)}
                              className="px-2 py-1 text-[11px] rounded border border-slate-300 hover:bg-slate-50"
                            >
                              Copy ID
                            </button>

                       
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {pending.data.length > 10 && (
              <div className="px-4 py-2 text-[11px] text-slate-500 border-t border-slate-100">
                Showing 10 of {pending.data.length}
              </div>
            )}
          </div>

     
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <div className="bg-[#02193D] text-white px-4 py-2 text-xs font-bold">
              Unavailable cars
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2">Car</th>
                    <th className="text-left px-3 py-2">Available</th>
                    <th className="text-left px-3 py-2">Active reservations</th>
                    <th className="text-left px-3 py-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {unavailable.loading && (
                    <tr>
                      <td className="px-3 py-3 text-slate-500" colSpan={4}>
                        Loading…
                      </td>
                    </tr>
                  )}

                  {!unavailable.loading && unavailable.error && (
                    <tr>
                      <td className="px-3 py-3 text-red-600" colSpan={4}>
                        {unavailable.error}
                      </td>
                    </tr>
                  )}

                  {!unavailable.loading && !unavailable.error && unavailable.data.length === 0 && (
                    <tr>
                      <td className="px-3 py-3 text-slate-500" colSpan={4}>
                        No unavailable cars.
                      </td>
                    </tr>
                  )}

                  {!unavailable.loading &&
                    !unavailable.error &&
                    unavailable.data.slice(0, 10).map((c) => (
                      <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-3 py-2">
                          <div className="font-medium">{c.name}</div>
                          <div className="text-[11px] text-slate-500">{c.id.slice(0, 8)}…</div>
                        </td>

                        <td className="px-3 py-2">
                          <span
                            className={
                              c.isAvailable
                                ? "text-[11px] px-2 py-1 rounded bg-green-50 text-green-700 border border-green-100"
                                : "text-[11px] px-2 py-1 rounded bg-red-50 text-red-700 border border-red-100"
                            }
                          >
                            {c.isAvailable ? "Yes" : "No"}
                          </span>
                        </td>

                        <td className="px-3 py-2">
                          {c.activeReservations?.length ? (
                            <div className="flex flex-col gap-1">
                              {c.activeReservations.slice(0, 2).map((r) => (
                                <div key={r.id} className="text-[11px]">
                                  <span className="font-medium">{r.id.slice(0, 8)}…</span>{" "}
                                  <span className="text-slate-500">
                                    {fmtDate(r.startDate)} → {fmtDate(r.endDate)}
                                  </span>
                                </div>
                              ))}
                              {c.activeReservations.length > 2 && (
                                <div className="text-[11px] text-slate-500">
                                  +{c.activeReservations.length - 2} more…
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => copy(c.id)}
                              className="px-2 py-1 text-[11px] rounded border border-slate-300 hover:bg-slate-50"
                            >
                              Copy ID
                            </button>

                            {/* jak masz routy */}
                            {/* <a
                              href={`/admin/cars/${c.id}`}
                              className="px-2 py-1 text-[11px] rounded bg-[#02193D] text-white hover:opacity-90"
                            >
                              Open
                            </a> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {unavailable.data.length > 10 && (
              <div className="px-4 py-2 text-[11px] text-slate-500 border-t border-slate-100">
                Showing 10 of {unavailable.data.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
