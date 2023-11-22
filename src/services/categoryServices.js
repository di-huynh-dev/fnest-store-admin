import axiosClient from '../utils/axiosClient';

const categoryServices = {
    getAllCategories() {
        const url = '/category';
        return axiosClient.get(url);
    },
    addCategory(accessToken, formData) {
        const url = `/admin/category`;
        return axiosClient.post(url, formData, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    updateCategory(accessToken, id, formData) {
        const url = `/admin/category/${id}`;
        return axiosClient.put(url, formData, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    deleteCategory(accessToken, id) {
        const url = `/admin/category/${id}`;
        return axiosClient.delete(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default categoryServices;
