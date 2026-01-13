import React, { useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { generatePdf, generateXlsx } from "../../services/reservations/service";

export const AdminExportsPage: React.FC = () => {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingXlsx, setLoadingXlsx] = useState(false);

  const run = async (fn: () => Promise<any>, okMsg: string, setLoading: (v: boolean) => void) => {
    setServerError("");
    setSuccess("");
    setLoading(true);
    try {
      await fn();
      setSuccess(okMsg);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Exports / Reports">
      <div className="p-10">
        <div className="max-w-[900px]">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-2 text-[#02193D]">Reservations exports</h2>
            <p className="text-xs text-slate-600 mb-6">
              Generate and download reports for reservations (PDF / XLSX).
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => run(generatePdf, "PDF generated and downloaded.", setLoadingPdf)}
                disabled={loadingPdf || loadingXlsx}
                className="flex justify-center items-center px-4 rounded cursor-pointer bg-[#02193D] h-[34px] text-xs font-bold text-white disabled:opacity-50"
              >
                {loadingPdf ? "Generating..." : "Generate PDF"}
              </button>

              <button
                onClick={() => run(generateXlsx, "XLSX generated and downloaded.", setLoadingXlsx)}
                disabled={loadingPdf || loadingXlsx}
                className="flex justify-center items-center px-4 rounded cursor-pointer bg-[#02193D] h-[34px] text-xs font-bold text-white disabled:opacity-50"
              >
                {loadingXlsx ? "Generating..." : "Generate XLSX"}
              </button>
            </div>

            {serverError && <p className="text-red-600 text-xs font-medium mt-4">{serverError}</p>}
            {success && <p className="text-green-700 text-xs font-medium mt-4">{success}</p>}

            <div className="mt-6 text-[11px] text-slate-500">
              Tip: jeśli backend zwraca link do pliku — przeglądarka pobierze go automatycznie.
              Jeśli zwraca base64 — też obsługujemy.
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
