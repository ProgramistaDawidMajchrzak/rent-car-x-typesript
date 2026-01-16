import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  getAllReservations,
  getReservationById,
  cancelReservation,
  softDeleteReservation,
  hardDeleteReservation,
  payReservation,
} from "../../services/reservations/service";

type ReservationRow = {
  id: string;
  carId: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalCost: number;
};

type ReservationDetails = {
  id: string;
  carId: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalCost: number;
};

type SortField = "carName" | "startDate" | "endDate" | "totalCost";
type SortDirection = "asc" | "desc";

const fmt = (iso: string) => {
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

export const AdminReservations: React.FC = () => {
  const [rows, setRows] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");


  const [sortField, setSortField] = useState<SortField>("startDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const [openId, setOpenId] = useState<string | null>(null);
  const [details, setDetails] = useState<ReservationDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const load = async () => {
    setLoading(true);
    setServerError("");
    try {
      const data = await getAllReservations();
      setRows(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setServerError(e?.message ?? "Failed to load reservations.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      let av: any = a[sortField];
      let bv: any = b[sortField];

      if (sortField === "startDate" || sortField === "endDate") {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      }

      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();

      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  const openDetails = async (id: string) => {
    setOpenId(id);
    setDetails(null);
    setDetailsError("");
    setDetailsLoading(true);
    try {
      const data = await getReservationById(id);
      setDetails(data);
    } catch (e: any) {
      setDetailsError(e?.message ?? "Failed to load details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const runAction = async (label: string, fn: () => Promise<any>) => {
    setServerError("");
    setSuccess("");
    try {
      await fn();
      setSuccess(`${label}: OK`);
      await load();
      setTimeout(() => setSuccess(""), 1200);
    } catch (e: any) {
      setServerError(e?.message ?? `${label} failed.`);
    }
  };

  const confirmAction = (text: string) => window.confirm(text);

  return (
    <AdminLayout title="Reservations">
      <div className="p-10">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <div className="text-xl font-bold text-[#02193D]">Reservations (All)</div>
            <div className="text-xs text-slate-500">Admin view • sort / paginate • actions</div>
          </div>

          <button
            onClick={load}
            className="px-4 h-[32px] rounded bg-[#02193D] text-white text-xs font-bold hover:opacity-90"
          >
            Refresh
          </button>
        </div>

        {serverError && (
          <div className="mb-4 text-xs font-medium text-red-700 bg-red-50 border border-red-100 rounded p-3">
            {serverError}
          </div>
        )}
        {success && (
          <div className="mb-4 text-xs font-medium text-green-700 bg-green-50 border border-green-100 rounded p-3">
            {success}
          </div>
        )}

        <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
          <table className="min-w-full text-xs">
            <thead className="bg-[#02193D] text-white">
              <tr>
                <th className="py-2 px-3 text-left">ID</th>
                <th
                  className="py-2 px-3 text-left cursor-pointer"
                  onClick={() => handleSort("carName")}
                >
                  Car{sortArrow("carName")}
                </th>
                <th className="py-2 px-3 text-left">CarId</th>
                <th
                  className="py-2 px-3 text-left cursor-pointer"
                  onClick={() => handleSort("startDate")}
                >
                  Start{sortArrow("startDate")}
                </th>
                <th
                  className="py-2 px-3 text-left cursor-pointer"
                  onClick={() => handleSort("endDate")}
                >
                  End{sortArrow("endDate")}
                </th>
                <th
                  className="py-2 px-3 text-left cursor-pointer"
                  onClick={() => handleSort("totalCost")}
                >
                  Total{sortArrow("totalCost")}
                </th>
                <th className="py-2 px-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="py-4 px-3 text-slate-500">
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 px-3 text-slate-500">
                    No reservations found.
                  </td>
                </tr>
              )}

              {!loading &&
                paged.map((r) => (
                  <tr key={r.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-2 px-3">
                      <div className="font-medium">{r.id.slice(0, 8)}…</div>
                      <button
                        onClick={() => copy(r.id)}
                        className="text-[11px] underline text-slate-600 hover:text-slate-900"
                      >
                        copy
                      </button>
                    </td>

                    <td className="py-2 px-3">{r.carName}</td>

                    <td className="py-2 px-3">
                      <div>{r.carId.slice(0, 8)}…</div>
                      <button
                        onClick={() => copy(r.carId)}
                        className="text-[11px] underline text-slate-600 hover:text-slate-900"
                      >
                        copy
                      </button>
                    </td>

                    <td className="py-2 px-3">{fmt(r.startDate)}</td>
                    <td className="py-2 px-3">{fmt(r.endDate)}</td>

                    <td className="py-2 px-3">{Number(r.totalCost ?? 0).toFixed(2)}</td>

                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openDetails(r.id)}
                          className="px-2 py-1 text-[11px] rounded bg-[#02193D] text-white hover:opacity-90"
                        >
                          Details
                        </button>

                  

                        <button
                          onClick={() =>
                            runAction("Cancel", () => cancelReservation(r.id))
                          }
                          className="px-2 py-1 text-[11px] rounded border border-slate-300 hover:bg-slate-50"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={() => {
                            if (!confirmAction("Soft delete this reservation?")) return;
                            runAction("Soft delete", () => softDeleteReservation(r.id));
                          }}
                          className="px-2 py-1 text-[11px] rounded bg-yellow-600 text-white hover:opacity-90"
                        >
                          Soft delete
                        </button>

                        <button
                          onClick={() => {
                            if (!confirmAction("PERMANENTLY delete this reservation?")) return;
                            runAction("Delete", () => hardDeleteReservation(r.id));
                          }}
                          className="px-2 py-1 text-[11px] rounded bg-red-600 text-white hover:opacity-90"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs">
          <div>
            Page {currentPage} of {totalPages} • Total: {sorted.length}
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

    
      {openId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[520px] max-w-[92vw] relative">
            <button
              onClick={() => setOpenId(null)}
              className="absolute top-2 right-3 text-slate-500 text-lg"
            >
              ×
            </button>

            <h3 className="text-lg font-bold mb-4 text-[#02193D]">Reservation details</h3>

            {detailsLoading && <div className="text-xs text-slate-500">Loading…</div>}
            {detailsError && (
              <div className="text-xs text-red-600 font-medium break-words">{detailsError}</div>
            )}

            {details && (
              <div className="text-xs grid grid-cols-1 gap-2">
                <div className="border border-slate-200 rounded p-3">
                  <div className="text-[11px] text-slate-500">Reservation ID</div>
                  <div className="font-medium">{details.id}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="border border-slate-200 rounded p-3">
                    <div className="text-[11px] text-slate-500">Car</div>
                    <div className="font-medium">{details.carName}</div>
                    <div className="text-[11px] text-slate-500 mt-1">CarId</div>
                    <div className="font-medium">{details.carId}</div>
                  </div>

                  <div className="border border-slate-200 rounded p-3">
                    <div className="text-[11px] text-slate-500">Total cost</div>
                    <div className="font-medium">{Number(details.totalCost ?? 0).toFixed(2)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="border border-slate-200 rounded p-3">
                    <div className="text-[11px] text-slate-500">Start</div>
                    <div className="font-medium">{fmt(details.startDate)}</div>
                  </div>
                  <div className="border border-slate-200 rounded p-3">
                    <div className="text-[11px] text-slate-500">End</div>
                    <div className="font-medium">{fmt(details.endDate)}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => copy(details.id)}
                    className="px-3 py-2 text-[11px] rounded border border-slate-300 hover:bg-slate-50"
                  >
                    Copy reservation ID
                  </button>
                  <button
                    onClick={() => copy(details.carId)}
                    className="px-3 py-2 text-[11px] rounded border border-slate-300 hover:bg-slate-50"
                  >
                    Copy car ID
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
