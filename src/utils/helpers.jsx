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
