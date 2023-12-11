import axiosClient from '../utils/axiosClient';

const statisticServices = {
    getStatistic(accessToken, month, year) {
        const url = `/admin/statistic?month=${month}&year=${year}`;
        return axiosClient.get(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default statisticServices;
