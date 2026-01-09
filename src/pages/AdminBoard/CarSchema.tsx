import * as yup from "yup";

const schema = yup.object({
  brand: yup.string().required("Brand is required"),
  model: yup.string().required("Model is required"),
  year: yup
    .number()
    .typeError("Year must be a number")
    .min(1900, "Year must be >= 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .required("Year is required"),
  fuelType: yup.string().required("Fuel type is required"),
  pricePerDay: yup
    .number()
    .typeError("Price must be a number")
    .min(1, "Price must be at least 1")
    .required("Price is required"),
  isAvailable: yup.boolean().required(),
});

// Finalny typ formularza:
export type CarFormData = {
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  pricePerDay: number;
  isAvailable: boolean;
  photo?: FileList; // tylko w TS, yup tego nie waliduje
};

export default schema;
