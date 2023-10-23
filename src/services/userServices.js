import axiosClient from '../utils/axiosClient';

const userServices = {
    getProfile(accessToken) {
        const url = '/user/profile';
        return axiosClient.get(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default userServices;
