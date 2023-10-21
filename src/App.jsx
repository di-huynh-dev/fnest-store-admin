import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
    CustomersManagement,
    GroupsProductManagement,
    Landing,
    OrdersManagement,
    ProductsManagement,
    SalesManagement,
    UsersManagement,
    HomeLayout,
    Error,
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
                path: 'admin/groups',
                element: <GroupsProductManagement />,
                errorElement: <ErrorElement />,
            },
        ],
    },
    {
        path: 'admin/auth/login',
        element: <ProductsManagement />,
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
