import request from "../request";
import { toApiError } from "../_helpers";

export const createReservation = async (body) => {
  try {
    const res = await request.post("/reservations/new", body);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Creating reservation failed.");
  }
};

export const getMyReservations = async () => {
  try {
    const res = await request.get("/reservations/my-reservations");
    return res.data;
  } catch (e) {
    throw toApiError(e, "Fetching my reservations failed.");
  }
};

export const getReservationById = async (id) => {
  try {
    const res = await request.get(`/reservations/${id}`);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Fetching reservation failed.");
  }
};

export const getAllReservations = async () => {
  try {
    const res = await request.get("/reservations/all");
    return res.data;
  } catch (e) {
    throw toApiError(e, "Fetching all reservations failed.");
  }
};

export const cancelReservation = async (id) => {
  try {
    const res = await request.post(`/reservations/${id}/cancel`);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Cancel reservation failed.");
  }
};

export const softDeleteReservation = async (id) => {
  try {
    const res = await request.delete(`/reservations/${id}/delete/soft`);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Soft delete reservation failed.");
  }
};

export const hardDeleteReservation = async (id) => {
  try {
    const res = await request.delete(`/reservations/${id}/delete`);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Delete reservation failed.");
  }
};

export const payReservation = async (id) => {
  try {
    const res = await request.post(`/reservations/${id}/pay`);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Pay reservation failed.");
  }
};

// Swagger: POST /generate-pdf -> text/plain -> string (brak body)
export const generatePdf = async () => {
  try {
    const res = await request.post("/reservations/generate-pdf");
    return res.data; // string
  } catch (e) {
    throw toApiError(e, "Generate PDF failed.");
  }
};

// analogicznie (zakładam też string)
export const generateXlsx = async () => {
  try {
    const res = await request.post("/reservations/generate-xlsx");
    return res.data; // string
  } catch (e) {
    throw toApiError(e, "Generate XLSX failed.");
  }
};
