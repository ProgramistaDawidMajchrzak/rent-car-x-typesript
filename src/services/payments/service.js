import request from "../request";
import { toApiError } from "../_helpers";

export const checkout = async (reservationId) => {
  try {
    const res = await request.post(`/payments/checkout/${reservationId}`);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Checkout failed.");
  }
};
