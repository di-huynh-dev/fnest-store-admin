import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Sidebar } from '../components';

const HomeLayout = () => {
    return (
        <>
            <main className="">
                <div className="flex relative">
                    <Sidebar />
                    <div className="min-h-screen w-full ml-[240px]">
                        <Header />
                        <Outlet />
                    </div>
                </div>
            </main>
        </>
    );
};

export default HomeLayout;
