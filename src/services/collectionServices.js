import axiosClient from '../utils/axiosClient';

const collectionServices = {
    getAllCollections() {
        const url = '/collection';
        return axiosClient.get(url);
    },
    addCollection(accessToken, formData) {
        const url = `/admin/collection`;
        return axiosClient.post(url, formData, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    updateCollection(accessToken, id, formData) {
        const url = `/admin/collection/${id}`;
        return axiosClient.put(url, formData, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    deleteCollection(accessToken, id) {
        const url = `/admin/collection/${id}`;
        return axiosClient.delete(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default collectionServices;
