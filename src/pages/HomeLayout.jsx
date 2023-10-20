import React from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { Header, Loading } from '../components';

const HomeLayout = () => {
    const navigation = useNavigation();
    const isPageLoading = navigation.state === 'loading';

    return (
        <>
            <div className="">
                <Header />
            </div>
            {isPageLoading ? (
                <Loading />
            ) : (
                <section className="align-element">
                    <Outlet />
                </section>
            )}
        </>
    );
};

export default HomeLayout;
