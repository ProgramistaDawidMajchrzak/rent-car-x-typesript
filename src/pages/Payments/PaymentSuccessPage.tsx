import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export const PaymentSuccessPage: React.FC = () => {
  const q = useQuery();

  const sessionId = q.get("session_id") || q.get("sessionId");
  const reservationId = q.get("reservationId") || q.get("reservation_id");
  const amount = q.get("amount");
  const currency = q.get("currency");

  return (
    <Layout>
      <div className="px-6 lg:px-32 py-10">
        <div className="max-w-[720px] mx-auto">
          <div className="bg-white rounded-2xl border border-slate-900/10 shadow-sm overflow-hidden">
            {/* top */}
            <div className="px-6 py-5 border-b border-slate-900/10 bg-slate-50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    Payment successful ✅
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Thanks! Your payment was processed and your reservation is now confirmed.
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>
            </div>

            {/* details */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-900/10">
                  <div className="text-xs text-slate-500">Status</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">PAID</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-900/10">
                  <div className="text-xs text-slate-500">Next steps</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    Check your reservations
                  </div>
                </div>

                {reservationId && (
                  <div className="p-4 rounded-xl border border-slate-900/10 sm:col-span-2">
                    <div className="text-xs text-slate-500">Reservation ID</div>
                    <div className="text-sm font-bold text-slate-900 mt-1 font-mono break-all">
                      {reservationId}
                    </div>
                  </div>
                )}

                {sessionId && (
                  <div className="p-4 rounded-xl border border-slate-900/10 sm:col-span-2">
                    <div className="text-xs text-slate-500">Stripe session</div>
                    <div className="text-sm text-slate-900 mt-1 font-mono break-all">
                      {sessionId}
                    </div>
                  </div>
                )}

                {(amount || currency) && (
                  <div className="p-4 rounded-xl border border-slate-900/10 sm:col-span-2">
                    <div className="text-xs text-slate-500">Amount</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      {amount ? amount : "—"} {currency ? currency.toUpperCase() : ""}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                <Link
                  to="/my-account"
                  className="inline-flex items-center justify-center px-5 h-[38px] rounded-lg bg-[#02193D] text-white text-xs font-bold hover:opacity-95"
                >
                  Go to my reservations
                </Link>

                <Link
                  to="/car-list"
                  className="inline-flex items-center justify-center px-5 h-[38px] rounded-lg border border-slate-900/20 text-slate-900 text-xs font-bold hover:bg-slate-50"
                >
                  Browse more cars
                </Link>
              </div>

              <p className="text-[11px] text-slate-500 mt-4">
                If you don’t see your payment reflected immediately, refresh the page in a moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
