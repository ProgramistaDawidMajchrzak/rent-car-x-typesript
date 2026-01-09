import request from "./request";



export const getCarsHome = async () => {
  try {
    const response = await request.get("/cars");
    return response.data;
  } catch (error) {
    console.error("GET /cars error:", error);
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Failed to load cars.");
  }
};

export const getCars = async (filters = {}) => {
  try {
    const params = {};

    if (filters.brand) params.brand = filters.brand;
    if (filters.model) params.model = filters.model;
    if (filters.fuelType) params.fuelType = filters.fuelType;
    if (filters.minPrice != null && filters.minPrice !== "") params.minPrice = filters.minPrice;
    if (filters.maxPrice != null && filters.maxPrice !== "") params.maxPrice = filters.maxPrice;

    // isAvailable: null = wszystkie, true/false = filtr
    if (filters.isAvailable === true) params.isAvailable = true;
    if (filters.isAvailable === false) params.isAvailable = false;

    const response = await request.get("/cars", { params });
    return response.data;
  } catch (error) {
    console.error("GET /cars error:", error);
    if (error.response?.data?.detail) throw new Error(error.response.data.detail);
    throw new Error("Failed to load cars.");
  }
};

export const getCarById = async (carId) => {
  try {
    const response = await request.get(`/cars/${carId}`);
    return response.data;
  } catch (error) {
    console.error("GET /cars/:id error:", error);
    throw new Error("Failed to load car details.");
  }
};


/**
 * POST /api/v1/cars
 * Body: { carData: { brand, model, year, fuelType, pricePerDay, isAvailable } }
 */
export const createCar = async (carData) => {
  try {
    const formData = new FormData();
    formData.append("brand", carData.brand);
    formData.append("model", carData.model);
    formData.append("year", String(carData.year));
    formData.append("fuelType", carData.fuelType);
    formData.append("pricePerDay", String(carData.pricePerDay));
    formData.append("isAvailable", String(carData.isAvailable));

    if (carData.photo && carData.photo[0]) {
      formData.append("photo", carData.photo[0]); // nazwa zgodna z CreateCarRequest.Photo
    }

    const response = await request.post("/cars", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("POST /cars error:", error);
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Failed to create car.");
  }
};

/**
 * PUT /api/v1/cars/{id}
 * Body: { id, brand, model, year, fuelType, pricePerDay, isAvailable }
 * (pasuje do EditCarCommand z C# – Id + pola)
 */
export const updateCar = async (id, carData) => {
  try {
    const payload = { 
      id,
      carData
    };

    const response = await request.put(`/cars/${id}`, payload);
    return response.data;

  } catch (error) {
    console.error("PUT /cars/{id} error:", error);
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Failed to update car.");
  }
};


/**
 * DELETE /api/v1/cars/{id}
 */
export const deleteCar = async (id) => {
  try {
    const response = await request.delete(`/cars/${id}`);
    return response.data;
  } catch (error) {
    console.error("DELETE /cars/{id} error:", error);
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Failed to delete car.");
  }
};
