import axiosClient from '../utils/axiosClient';

const customerServices = {
    getAllCumstomers(accessToken) {
        const url = '/admin/user';
        return axiosClient.get(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    getAllCategories(accessToken) {
        const url = '/admin/category';
        return axiosClient.get(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default customerServices;
