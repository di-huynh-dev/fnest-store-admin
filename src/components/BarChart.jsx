import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Expenses',
            data: [15000, 10000, 14000, 11000, 16000, 12000],
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
            display: false,
        },
        title: {
            display: true,
            text: 'Monthly Expenses',
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Months',
            },
        },
        y: {
            title: {
                display: true,
                text: 'Amount (USD)',
            },
        },
    },
};

function App() {
    return <Bar data={data} options={options} />;
}

export default App;
