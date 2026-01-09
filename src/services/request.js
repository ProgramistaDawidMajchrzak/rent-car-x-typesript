import axios from 'axios';

const request = axios.create({
    baseURL: 'http://localhost:5113/api/v1',
    headers: {
        "Content-Type": "application/json",
    }
});

request.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    console.log("Axios → token wysyłany:", token);

    if (token) req.headers.Authorization = `Bearer ${token}`;

    console.log("Final headers:", req.headers);

    return req;
});


export default request;
