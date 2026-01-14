import request from "../request";
import { toApiError } from "../_helpers";

export const getCars = async (params = {}) => {
  try {
    const res = await request.get("/cars", { params });
    return res.data;
  } catch (e) {
    throw toApiError(e, "Fetching cars failed.");
  }
};

export const getCarById = async (id) => {
  try {
    const res = await request.get(`/cars/${id}`);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Fetching car failed.");
  }
};

export const createCar = async (carData) => {
  try {
    const res = await request.post("/cars", { carData });
    return res.data;
  } catch (e) {
    throw toApiError(e, "Creating car failed.");
  }
};

export const updateCar = async (id, carData) => {
  try {
    const payload = {
      id,
      carData,
    };
    const res = await request.put(`/cars/${id}`, payload);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Updating car failed.");
  }
};


export const deleteCar = async (id) => {
  try {
    const res = await request.delete(`/cars/${id}`);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Deleting car failed.");
  }
};
