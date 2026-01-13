import request from "../request";
import { toApiError } from "../_helpers";

export const getUnavailableCars = async () => {
  try {
    const res = await request.get("/admin/monitor/unavailable-cars");
    return res.data;
  } catch (e) {
    throw toApiError(e, "Fetching unavailable cars failed.");
  }
};

export const getPendingReservations = async () => {
  try {
    const res = await request.get("/admin/monitor/pending-reservations");
    return res.data;
  } catch (e) {
    throw toApiError(e, "Fetching pending reservations failed.");
  }
};

export const getCarsStatuses = async () => {
  try {
    const res = await request.get("/admin/monitor/cars-statuses");
    return res.data;
  } catch (e) {
    throw toApiError(e, "Fetching cars statuses failed.");
  }
};

export const getReservationsDeadlineToday = async () => {
  try {
    const res = await request.get("/admin/monitor/reservations-deadline-today");
    return res.data;
  } catch (e) {
    throw toApiError(e, "Fetching deadline reservations failed.");
  }
};

export const getSystemLockedIds = async () => {
  try {
    const res = await request.get("/admin/monitor/system-locked-ids");
    return res.data;
  } catch (e) {
    throw toApiError(e, "Fetching system locks failed.");
  }
};
