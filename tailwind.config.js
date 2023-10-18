/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            sans: ['Nunito', 'sans-serif'],
            fontFamily: {},
        },
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
    daisyui: {
        extend: {
            sans: ['Nunito', 'sans-serif'],
        },
        themes: [
            {
                mytheme: {
                    primary: '#F55555',

                    secondary: '#EF683A',

                    accent: '#1dcdbc',

                    neutral: '#F6F9FC',

                    'base-100': '#ffffff',

                    info: '#AB7B60',

                    background: '#f6f9fC',

                    success: '#36d399',

                    warning: '#fbbd23',

                    error: '#f87272',
                    hot: '#f94C10',
                },
            },
        ],
    },
};
