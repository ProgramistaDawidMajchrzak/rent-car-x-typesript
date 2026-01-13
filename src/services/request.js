import axios from "axios";

const request = axios.create({
  baseURL: "https://rentcarx-fggbcugferbhg2bh.polandcentral-01.azurewebsites.net/api/v1",
  headers: { "Content-Type": "application/json" },
});

request.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default request;
