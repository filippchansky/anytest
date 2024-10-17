import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { router } from './router/router.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const mainRouter = createBrowserRouter(router);

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <RouterProvider router={mainRouter} />
        </ThemeProvider>
    </>
);
