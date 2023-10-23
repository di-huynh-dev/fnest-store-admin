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
                <div>
                    <Header />
                    <div className="flex">
                        <Sidebar />
                        <div className="w-full">
                            <Outlet />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomeLayout;
