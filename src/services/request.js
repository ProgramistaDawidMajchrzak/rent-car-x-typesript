import axios from 'axios';

const request = axios.create({
    baseURL: 'https://localhost:7100/api',
});

request.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    }
    return req;
});

export default request;