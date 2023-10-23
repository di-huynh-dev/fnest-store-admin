import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

axiosClient.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        return Promise.reject(error);
    },
);
export default axiosClient;
