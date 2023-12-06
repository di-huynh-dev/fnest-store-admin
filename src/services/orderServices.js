import axiosClient from '../utils/axiosClient';

const orderServices = {
    getAllOrders(accessToken) {
        const url = '/staff/order';
        return axiosClient.get(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default orderServices;
