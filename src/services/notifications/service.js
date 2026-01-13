import request from "../request";
import { toApiError } from "../_helpers";

export const registerDevice = async (body) => {
  try {
    const res = await request.post("/notifications/register-device", body);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Register device failed.");
  }
};
