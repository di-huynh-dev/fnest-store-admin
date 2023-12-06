import React from 'react';

const TableLoader = () => {
    return (
        <div className="m-20">
            <span className="loading loading-ring loading-xs"></span>
            <span className="loading loading-ring loading-sm"></span>
            <span className="loading loading-ring loading-md"></span>
            <span className="loading loading-ring loading-lg"></span>
            <p>Đang tải dữ liệu...</p>
        </div>
    );
};

export default TableLoader;
