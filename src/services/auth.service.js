import request from './request';
import axios from 'axios';

export const login = async (body) => {
  try {
    const response = await request.post('/auth/login', body);
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail); 
    }
    throw new Error("Login failed.");
  }
};


export const register = async (body) => {
    try {
        const response = await request.post('/auth/register', body);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("API ERROR:", error.response.status, error.response.data);
        } else {
            console.error("AXIOS ERROR:", error.message);
        }
    throw error;
}

};
const API = "http://localhost:5113/api/v1";

export const confirmEmail = async (query) => {
  const response = await axios.get(`${API}${query}`);
  return response.data;
};

export const forgotPassword = async (email) => {
  try {
    const response = await request.post(
      "/auth/forgot-password",
      JSON.stringify(email),
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.log("STATUS:", error?.response?.status);
    console.log("DATA:", error?.response?.data);
    console.log("VALIDATION ERRORS:", error?.response?.data?.errors);

    const msg =
      error?.response?.data?.detail ||
      error?.response?.data?.title ||
      "Forgot password failed.";
    throw new Error(msg);
  }
};

export const resetPassword = async (body) => {
  try {
    const response = await request.post("/auth/reset-password", body);
    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      "Reset password failed.";
    throw new Error(msg);
  }
};



// export const logout = async () => {
//     try {
//         const response = await request.post('/auth/logout');
//         return response.data;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// };