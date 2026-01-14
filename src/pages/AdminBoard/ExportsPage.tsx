import React, { useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { generatePdf, generateXlsx } from "../../services/reservations/service";

export const AdminExportsPage: React.FC = () => {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingXlsx, setLoadingXlsx] = useState(false);

  const run = async (fn: () => Promise<any>, okMsg: string, setLoading: (v: boolean) => void) => {
    // Resetujemy stany przed nową akcją
    setServerError("");
    setSuccess("");
    setLoading(true);

    try {
      await fn();
      setSuccess(okMsg);
    } catch (e) {
      // Jeśli błąd to Blob (częste przy responseType: 'blob'), trzeba by go sparsować na tekst, 
      // ale na razie obsłużmy standardowo:
      setServerError(e instanceof Error ? e.message : "Action failed.");
      console.error("Export error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Exports / Reports">
      {/* Container ze scrollowaniem (nawiązując do Twojego pierwszego pytania) */}
      <div className="p-10 h-full overflow-y-auto"> 
        <div className="max-w-[900px]">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-2 text-[#02193D]">Reservations exports</h2>
            <p className="text-xs text-slate-600 mb-6">
              Generate and download reports for reservations (PDF / XLSX).
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                type="button" // Dodano type button
                onClick={() => run(generatePdf, "PDF generated and downloaded.", setLoadingPdf)}
                disabled={loadingPdf || loadingXlsx}
                className="flex justify-center items-center px-4 rounded cursor-pointer bg-[#02193D] h-[34px] text-xs font-bold text-white disabled:opacity-50 hover:bg-[#032a66] transition-colors"
              >
                {loadingPdf ? "Generating..." : "Generate PDF"}
              </button>

              <button
                type="button" // Dodano type button
                onClick={() => run(generateXlsx, "XLSX generated and downloaded.", setLoadingXlsx)}
                disabled={loadingPdf || loadingXlsx}
                className="flex justify-center items-center px-4 rounded cursor-pointer bg-[#02193D] h-[34px] text-xs font-bold text-white disabled:opacity-50 hover:bg-[#032a66] transition-colors"
              >
                {loadingXlsx ? "Generating..." : "Generate XLSX"}
              </button>
            </div>

            {/* Komunikaty zwrotne */}
            {serverError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-xs font-medium">{serverError}</p>
              </div>
            )}
            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-green-700 text-xs font-medium">{success}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};