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


export const createCar = async (carData, photoFile) => {
  try {
    const fd = new FormData();
    fd.append("brand", carData.brand);
    fd.append("model", carData.model);
    fd.append("year", String(carData.year));
    fd.append("fuelType", carData.fuelType);
    fd.append("pricePerDay", String(carData.pricePerDay));
    fd.append("isAvailable", String(!!carData.isAvailable));

    if (photoFile) {
      fd.append("image", photoFile);
    }

    return (await request.post("/cars", fd)).data;
  } catch (e) {
    throw toApiError(e, "Creating car failed.");
  }
};

export const updateCar = async (id, carData, photoFile) => {
  try {
    const fd = new FormData();
    fd.append("id", id);
    if (carData.brand) fd.append("brand", carData.brand);
    if (carData.model) fd.append("model", carData.model);
    if (carData.year) fd.append("year", String(carData.year));
    if (carData.fuelType) fd.append("fuelType", carData.fuelType);
    if (carData.pricePerDay) fd.append("pricePerDay", String(carData.pricePerDay));
    fd.append("isAvailable", String(!!carData.isAvailable));

    if (photoFile) {
      fd.append("image", photoFile);
    }

    return (await request.put(`/cars/${id}`, fd)).data;
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
