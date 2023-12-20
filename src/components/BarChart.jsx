import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
    const formattedData = {
        labels: data.numOfOrderByDays.map((item) => item.date),
        datasets: [
            {
                label: 'Số lượng đơn hàng',
                data: data.numOfOrderByDays.map((item) => item.amount),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: 'Thống kê số lượng đơn hàng theo ngày trong tháng',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Ngày',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Số lượng đơn hàng',
                },
                stepSize: 1,
            },
        },
    };

    return <Bar data={formattedData} options={options} />;
};

export default BarChart;
