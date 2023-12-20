import React from 'react';

const TableLoader = () => {
    return (
        <div className="flex justify-center">
            <div className="m-20">
                <span className="loading loading-ring loading-xs"></span>
                <span className="loading loading-ring loading-sm"></span>
                <span className="loading loading-ring loading-md"></span>
                <span className="loading loading-ring loading-lg"></span>
                <p>Đang tải dữ liệu...</p>
            </div>
        </div>
    );
};

export default TableLoader;
