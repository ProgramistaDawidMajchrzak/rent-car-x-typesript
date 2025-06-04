import request from './request';

export const login = async (body) => {
    try {
        const response = await request.post('/auth/login', body);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export const register = async (body) => {
    try {
        const response = await request.post('/auth/register', body);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
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