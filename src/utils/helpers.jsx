import React, { useState, useEffect } from 'react';

export default function PreviewImage({ file }) {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        // Kiểm tra xem file có tồn tại
        if (file) {
            // Tạo đối tượng preview từ file
            const previewData = {
                url: URL.createObjectURL(file),
                name: file.name,
                id: file.name, // Sử dụng tên file làm key
            };

            // Cập nhật state với đối tượng preview
            setPreview(previewData);

            // Cleanup function để xóa đối tượng URL khi component unmount
            return () => {
                URL.revokeObjectURL(previewData.url);
            };
        }
    }, [file]);

    return (
        <div>
            {/* Hiển thị ảnh preview */}
            {preview && (
                <div key={preview.id} className="image-preview">
                    <img src={preview.url} alt={preview.name} style={{ width: '300px' }} />
                    <p>{preview.name}</p>
                </div>
            )}
        </div>
    );
}
export const formatPrice = (number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(number);
};
export const isTokenExpired = (token) => {
    if (!token) {
        return true;
    }

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Giải mã phần payload
        const expirationTime = decodedToken.exp * 1000; // Chuyển đổi giây thành mili-giây

        return Date.now() >= expirationTime; // Kiểm tra xem thời gian hiện tại có lớn hơn thời gian hết hạn không
    } catch (error) {
        console.error('Error decoding or parsing token:', error);
        return true; // Nếu có lỗi, coi như token đã hết hạn
    }
};

export const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    return formattedDate;
};
