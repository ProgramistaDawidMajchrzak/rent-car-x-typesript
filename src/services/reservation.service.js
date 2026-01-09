import request from "./request";

export const createReservation = async (data) => {
  try {
    const response = await request.post("/reservations", data);
    return response.data;
  } catch (error) {
    console.error("POST /reservations error:", error);
    throw new Error("Failed to create reservation.");
  }
};

export const getMyReservations = async () => {
  try {
    const response = await request.get("/reservations/my-reservations");
    return response.data;
  } catch (error) {
    console.error("GET /my-reservations error:", error);
    throw new Error("Failed to load reservations.");
  }
};

export const deleteReservation = async (id) => {
  try {
    await request.delete(`/reservations/${id}/delete/soft`);
  } catch (error) {
    console.error("DELETE reservation error:", error);
    throw new Error("Failed to delete reservation.");
  }
};

export const payReservation = async (id) => {
  try {
    const response = await request.post(`/reservations/${id}/pay`);
    return response.data.checkoutUrl;
  } catch (error) {
    console.error("PAY reservation error:", error);
    throw new Error("Payment initiation failed.");
  }
};
