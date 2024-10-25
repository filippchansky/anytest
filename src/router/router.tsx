import App from '../App';
import Layout from '../components/Layout/Layout';
import About from '../pages/About';
import Micro from '../pages/Micro';
import WebSocket from '../pages/WebSocket';

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
            {
                label: 'Microphone',
                path: '/micro',
                element: <Micro/>
            },
            {
                label: 'WebSocket',
                path: '/ws',
                element: <WebSocket/>
            }
        ],
    },
];
