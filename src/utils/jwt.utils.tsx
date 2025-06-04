export function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    const roleClaim = decodedPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (Array.isArray(roleClaim)) return roleClaim[0];
    return roleClaim;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}