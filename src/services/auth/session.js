export function saveToken(token) {
  if (token) localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}
