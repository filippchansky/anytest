import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import About from './pages/About';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Layout from './components/Layout/Layout.tsx';

const router = createBrowserRouter([
  {
      path: '/',
      element: <Layout />, // Оборачиваем все страницы в Layout
      children: [
          {
              path: '/',
              element: <App />,
          },
          {
              path: '/about',
              element: <About />,
          },
      ],
  },
]);

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <RouterProvider router={router} />
            </ThemeProvider>
    </>
);
