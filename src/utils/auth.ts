export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
