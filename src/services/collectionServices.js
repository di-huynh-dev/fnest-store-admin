import axiosClient from '../utils/axiosClient';

const collectionServices = {
    getAllCollections(accessToken) {
        const url = '/admin/collection';
        return axiosClient.get(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    addCollection(accessToken, name) {
        const url = `/admin/collection`;
        return axiosClient.post(
            url,
            { name },
            {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
    },
    updateCollection(accessToken, id, name) {
        const url = `/admin/collection/${id}`;
        return axiosClient.put(
            url,
            { name },
            {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
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
