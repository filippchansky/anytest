import App from '../App';
import Layout from '../components/Layout/Layout';
import About from '../pages/About';

export const router = [
    {
        path: '/',
        element: <Layout />, // Оборачиваем все страницы в Layout
        children: [
            {
                label: 'Home',
                path: '/',
                element: <App />,
            },
            {
                label: 'About',
                path: '/about',
                element: <About />,
            },
        ],
    },
];
