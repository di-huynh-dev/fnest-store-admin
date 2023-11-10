import { useState, useEffect } from 'react';

export default function PreviewImage({ files }) {
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (files && files.length > 0) {
            const previewUrls = files.map((file, index) => ({
                url: URL.createObjectURL(file),
                name: file.name,
                id: index,
            }));
            setPreviews(previewUrls);
        }
    }, [files]);

    return (
        <div>
            {previews.map((preview) => (
                <div key={preview.id} className="image-preview">
                    <img src={preview.url} alt={preview.name} style={{ width: '300px' }} />
                    <p>{preview.name}</p>
                </div>
            ))}
        </div>
    );
}
