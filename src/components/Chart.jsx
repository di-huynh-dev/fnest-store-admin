import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Expenses',
            data: [15000, 10000, 14000, 11000, 16000, 12000, 8000, 14000, 11000, 12000, 23000, 12000],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
};

const options = {
    responsive: true,
    tension: 0.4,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};

function App() {
    return <Line data={data} options={options} />;
}

export default App;
