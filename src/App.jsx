import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOutSuccess } from './features/authSlice';
import {
    CustomersManagement,
    CategoriesManagement,
    OrdersManagement,
    ProductsManagement,
    SalesManagement,
    UsersManagement,
    HomeLayout,
    Error,
    SignIn,
    CollectionsManagement,
    RoomsManagement,
    DiscountsManagement,
    NewsManagement,
    FeedbacksManagement,
    Landing,
} from './pages/';

import { ErrorElement } from './components';
import { useEffect } from 'react';
import { isTokenExpired } from './utils/helpers';

const router = createBrowserRouter([
    {
        path: '',
        element: <HomeLayout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Landing />,
                errorElement: <ErrorElement />,
            },
            {
                path: 'admin/sales',
                element: <SalesManagement />,
                errorElement: <ErrorElement />,
            },
            {
                path: 'admin/products',
                element: <ProductsManagement />,
                errorElement: <ErrorElement />,
            },
            {
                path: 'admin/orders',
                element: <OrdersManagement />,
                errorElement: <ErrorElement />,
            },

            {
                path: 'admin/users',
                element: <UsersManagement />,
                errorElement: <ErrorElement />,
            },
            {
                path: 'admin/customers',
                element: <CustomersManagement />,
                errorElement: <ErrorElement />,
            },
            {
                path: 'admin/categories',
                element: <CategoriesManagement />,
                errorElement: <ErrorElement />,
            },
            {
                path: 'admin/discounts',
                element: <DiscountsManagement />,
                errorElement: <ErrorElement />,
            },
            {
                path: 'admin/collections',
                element: <CollectionsManagement />,
                errorElement: <ErrorElement />,
            },
            {
                path: 'admin/rooms',
                element: <RoomsManagement />,
                errorElement: <ErrorElement />,
            },
            {
                path: 'admin/news',
                element: <NewsManagement />,
                errorElement: <ErrorElement />,
            },
            {
                path: 'admin/feedbacks',
                element: <FeedbacksManagement />,
                errorElement: <ErrorElement />,
            },
        ],
    },
    {
        path: 'admin/auth/login',
        element: <SignIn />,
        errorElement: <ErrorElement />,
    },
]);

function App() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.loginAdmin?.token);
    useEffect(() => {
        if (token) {
            const expire = isTokenExpired(token);
            console.log(expire);
            if (expire) {
                dispatch(logOutSuccess());
            }
        }
    }, []);
    return <RouterProvider router={router} />;
}

export default App;
