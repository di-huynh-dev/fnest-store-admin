import React from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { Header, Loading, Sidebar } from '../components';

const HomeLayout = () => {
    const navigation = useNavigation();

    const isPageLoading = navigation.state === 'loading';

    return (
        <div className="">
            {isPageLoading ? (
                <Loading />
            ) : (
                <div>
                    <div className="flex">
                        <Sidebar />
                        <div className="w-full">
                            <Header />
                            <Outlet />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeLayout;
