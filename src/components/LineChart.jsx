import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ data }) => {
    const formattedData = {
        labels: data.numOfOrderByDays.map((item) => item.date),
        datasets: [
            {
                label: 'Doanh thu theo ngày trong tháng (triệu đồng)',
                data: data.incomeByDays.map((item) => item.incomeByDay),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        tension: 0,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Thống kê doanh thu theo ngày',
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
                    text: 'Số tiền(triệu đồng)',
                },
                max: Math.max(...data.incomeByDays.map((item) => item.incomeByDay)) + 1,
                stepSize: 1,
            },
        },
    };

    return <Line data={formattedData} options={options} />;
};

export default LineChart;
