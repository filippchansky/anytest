import React from 'react'
import { Link, Outlet } from 'react-router-dom';

interface LayoutProps {
}

const Layout:React.FC<LayoutProps> = () => {

    const pages = [
        {
            link: '/',
            label: 'Home'
        },
        {
            link: '/about',
            label: 'About Us'
        }
    ]

    return (
        <>
            <header>
                <ul>
                    {pages.map(item => (
                        <li>
                            <Link to={item.link}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
            </header>
            <main>
                <Outlet/>
            </main>
        </>
    )
}
export default Layout;