
import {jwtDecode} from "jwt-decode";

export function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    console.log("Decoded JWT Payload:", decodedPayload);

    const roleClaim =
      decodedPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decodedPayload["role"] ||
      decodedPayload["roles"];

    if (Array.isArray(roleClaim)) return roleClaim[0];
    return roleClaim || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

type DecodedToken = {
  unique_name?: string;
  name?: string;
  [key: string]: any;
};

export const getUsernameFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.unique_name || decoded.name || null;
  } catch {
    return null;
  }
};

