import schema from "../constants/carShcema.json";

export type FuelType = (typeof schema.fuelTypes)[number];

export const fuelTypes = schema.fuelTypes;

export const brands = schema.brands.map((b) => b.name);

export const getModelsByBrand = (brand: string) => {
  const found = schema.brands.find((b) => b.name === brand);
  return found?.models ?? [];
};
