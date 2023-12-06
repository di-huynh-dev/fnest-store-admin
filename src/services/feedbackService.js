import axiosClient from '../utils/axiosClient';

const feedbackServices = {
    getAllFeedbacks(accessToken) {
        const url = '/admin/feedback';
        return axiosClient.get(url, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default feedbackServices;
