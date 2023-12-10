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
    addStaff(accessToken, username, password, displayName, role) {
        const url = '/admin/user';
        return axiosClient.post(
            url,
            {
                username,
                password,
                displayName,
                role,
            },
            {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
    },
    updateUser(accessToken, id, status) {
        const url = `/admin/user/status/${id}`;
        return axiosClient.patch(
            url,
            { status },
            {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
    },
};

export default userServices;
