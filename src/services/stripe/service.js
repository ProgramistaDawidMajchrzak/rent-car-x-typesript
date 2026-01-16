import request from "../request";
import { toApiError } from "../_helpers";

export const syncProducts = async () => {
  try {
    const res = await request.post("/admin/stripe/sync-products");
    return res.data;
  } catch (e) {
    throw toApiError(e, "Sync products failed.");
  }
};


export const postWebhook = async (body, headers = {}) => {
  try {
    const res = await request.post("/stripe/webhook", body, { headers });
    return res.data;
  } catch (e) {
    throw toApiError(e, "Webhook call failed.");
  }
};
