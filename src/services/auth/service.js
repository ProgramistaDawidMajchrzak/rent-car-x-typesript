import request from "../request";
import { toApiError, extractJwtToken } from "../_helpers";

export const register = async (body) => {
  try {
    // body: { username, email, password }
    // response: { jwtToken, userId, confirmationLink }
    const res = await request.post("/auth/register", body);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Register failed.");
  }
};

export const login = async (body) => {
  try {
    // body: { email, password }
    const res = await request.post("/auth/login", body);

    const token = extractJwtToken(res.data);
    return { data: res.data, token };
  } catch (e) {
    throw toApiError(e, "Login failed.");
  }
};

export const logout = async () => {
  try {
    const res = await request.post("/auth/logout");
    return res.data;
  } catch (e) {
    throw toApiError(e, "Logout failed.");
  }
};

export const confirmEmail = async ({ userId, token }) => {
  try {
    // Swagger: query params
    const res = await request.post("/auth/confirm-email", null, {
      params: { userId, token },
    });
    return res.data;
  } catch (e) {
    throw toApiError(e, "Confirm email failed.");
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    // response: { resetLink }
    const res = await request.post("/auth/forgot-password", { email });
    return res.data;
  } catch (e) {
    throw toApiError(e, "Forgot password failed.");
  }
};

export const resetPassword = async (body) => {
  try {
    // body: { userId, token, newPassword }
    const res = await request.post("/auth/reset-password", body);
    return res.data;
  } catch (e) {
    throw toApiError(e, "Reset password failed.");
  }
};

export const deleteAccount = async () => {
  try {
    const res = await request.delete("/auth/delete-account");
    return res.data;
  } catch (e) {
    throw toApiError(e, "Delete account failed.");
  }
};

export const getDeletedUsers = async () => {
  try {
    const res = await request.get("/auth/deleted-users");
    return res.data;
  } catch (e) {
    throw toApiError(e, "Fetching deleted users failed.");
  }
};
