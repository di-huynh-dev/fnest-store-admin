import axiosClient from '../utils/axiosClient';

const productServices = {
    getAllProducts() {
        const url = '/product';
        return axiosClient.get(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    },
    addProduct(accessToken, formData) {
        const url = '/admin/product';
        return axiosClient.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    deleteProduct(accessToken, id) {
        const url = `/admin/product/${id}`;
        return axiosClient.delete(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default productServices;
