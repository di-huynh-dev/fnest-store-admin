import axiosClient from '../utils/axiosClient';

const authServices = {
    login(username, password) {
        const url = '/auth/login';
        return axiosClient.post(url, { username, password });
    },
    getProfile(accessToken) {
        const url = `/user/profile`;
        return axiosClient.get(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default authServices;
