import axiosClient from '../utils/axiosClient';

const couponServices = {
    getAllCoupons() {
        const url = '/coupon-code';
        return axiosClient.get(url);
    },
    addCoupon(accessToken, code, value, description, minOrderValue, maxDiscount, times, beginDate, endDate) {
        const url = `/admin/coupon-code`;
        return axiosClient.post(
            url,
            { code, value, description, minOrderValue, maxDiscount, times, beginDate, endDate },
            {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
    },

    deleteCoupon(accessToken, id) {
        const url = `/admin/coupon-code/${id}`;
        return axiosClient.delete(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};

export default couponServices;
