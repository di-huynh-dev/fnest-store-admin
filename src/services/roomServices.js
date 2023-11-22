import axiosClient from '../utils/axiosClient';

const roomServices = {
    getAllRooms() {
        const url = '/room';
        return axiosClient.get(url);
    },
    addRoom(accessToken, formData) {
        const url = `/admin/room`;
        return axiosClient.post(url, formData, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    updateRoom(accessToken, id, formData) {
        const url = `/admin/room/${id}`;
        return axiosClient.put(url, formData, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    deleteRoom(accessToken, id) {
        const url = `/admin/room/${id}`;
        return axiosClient.delete(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default roomServices;
