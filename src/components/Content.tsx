import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Login from './Login';
import App from '../App';

const Content = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    return (
        <div className='flex flex-col h-fit dark:bg-gray-800 '>
            <Header />
            <div className='flex w-full justify-center'>
                {token ? (
                    <Outlet />
                ) : (
                    <App searchQuery={''} />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Content;
