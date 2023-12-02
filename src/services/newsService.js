import axiosClient from '../utils/axiosClient';

const newsServices = {
    getAllNews(accessToken) {
        const url = '/admin/post';
        return axiosClient.get(url, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    addPost(accessToken, formData) {
        const url = `/admin/post`;
        return axiosClient.post(url, formData, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    updatePost(accessToken, id, formData) {
        const url = `/admin/post/${id}`;
        return axiosClient.put(url, formData, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    deletePost(accessToken, id) {
        const url = `/admin/post/${id}`;
        return axiosClient.delete(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default newsServices;
