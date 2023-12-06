import React from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { Header, Loading, Sidebar } from '../components';

const HomeLayout = () => {
    const navigation = useNavigation();
    const isPageLoading = navigation.state === 'loading';

    return (
        <>
            {isPageLoading ? (
                <Loading />
            ) : (
                <main>
                    <div className="flex relative">
                        <Sidebar />
                        <div className="min-h-screen w-full ml-[14rem]">
                            <Header />
                            <Outlet />
                        </div>
                    </div>
                </main>
            )}
        </>
    );
};

export default HomeLayout;
