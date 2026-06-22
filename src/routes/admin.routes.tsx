import type { RouteObject } from 'react-router-dom';
import { AdminRoute } from '../components/auth/AdminRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Dashboard } from '../pages/admin/Dashboard';
import { Products } from '../pages/admin/Products';
import CreateProduct from '../pages/admin/CreateProduct';
import { EditProduct } from '../pages/admin/EditProduct';
import { ManageCategories } from '../pages/admin/ManageCategories';
import { Orders } from '../pages/admin/Orders';
import { Customers } from '../pages/admin/Customers';

export const adminRoutes: RouteObject[] = [
    {
        path: 'admin',
        element: <AdminRoute />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Dashboard /> },
                    { path: 'products', element: <Products /> },
                    { path: 'products/create', element: <CreateProduct /> },
                    { path: 'products/edit/:id', element: <EditProduct /> },
                    { path: 'categories', element: <ManageCategories /> },
                    { path: 'orders', element: <Orders /> },
                    { path: 'customers', element: <Customers /> },
                ],
            },
        ],
    },
];