import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
    CustomersManagement,
    CategoriesManagement,
    Landing,
    OrdersManagement,
    ProductsManagement,
    SalesManagement,
    UsersManagement,
    HomeLayout,
    Error,
    SignIn,
    CollectionsManagement,
    RoomsManagement,
} from './pages/';

import { ErrorElement } from './components';

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
                path: 'admin/sales',
                element: <SalesManagement />,
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
                path: 'admin/collections',
                element: <CollectionsManagement />,
                errorElement: <ErrorElement />,
            },
            {
                path: 'admin/rooms',
                element: <RoomsManagement />,
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
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
