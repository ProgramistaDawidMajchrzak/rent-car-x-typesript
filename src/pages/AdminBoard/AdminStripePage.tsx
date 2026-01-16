import React, { useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { syncProducts } from "../../services/stripe/service";

export const AdminStripePage: React.FC = () => {
  const [serverError, setServerError] = useState("");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [success, setSuccess] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const extractDetails = (e: unknown) => {

    if (e instanceof Error) return e.message;

    try {
      return JSON.stringify(e, null, 2);
    } catch {
      return String(e);
    }
  };

  const onSync = async () => {
    setServerError("");
    setErrorDetails("");
    setSuccess("");
    setIsSyncing(true);

    try {
      const res = await syncProducts();
      setSuccess(res ? `Synced successfully: ${typeof res === "string" ? res : "OK"}` : "Synced successfully (OK).");
    } catch (e) {
      const msg = extractDetails(e);
      setServerError("Sync failed.");
      setErrorDetails(msg);
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AdminLayout title="Stripe Admin">
      <div className="p-10">
        <div className="max-w-[900px]">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-2 text-[#02193D]">Sync Stripe products</h2>
            <p className="text-xs text-slate-600 mb-6">
              This will synchronize cars/products with Stripe (products + prices). Requires valid Stripe keys on backend.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="flex justify-center items-center px-4 rounded cursor-pointer bg-[#02193D] h-[34px] text-xs font-bold text-white disabled:opacity-50"
              >
                {isSyncing ? "Syncing..." : "Sync products"}
              </button>
            </div>

            {success && (
              <div className="mt-4 border border-green-200 bg-green-50 rounded-lg p-3">
                <p className="text-green-800 text-xs font-medium">{success}</p>
              </div>
            )}

            {serverError && (
              <div className="mt-4 border border-red-200 bg-red-50 rounded-lg p-3">
                <p className="text-red-700 text-xs font-medium">{serverError}</p>

                {errorDetails && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer text-red-700 underline">
                      Show error details
                    </summary>
                    <pre className="mt-2 text-[11px] whitespace-pre-wrap break-words text-red-900">
                      {errorDetails}
                    </pre>
                  </details>
                )}
              </div>
            )}

      
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
