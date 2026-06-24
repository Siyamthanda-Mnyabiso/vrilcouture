// src/routes/admin.routes.tsx
import type { RouteObject } from 'react-router-dom';
import { RequireAdmin } from '../components/auth/RequireAdmin';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Dashboard } from '../pages/admin/Dashboard';
import { AdminProducts } from '../pages/admin/AdminProducts';
import { AdminProductForm } from '../pages/admin/AdminProductForm';
import { AdminOrders } from '../pages/admin/AdminOrders';
import { AdminCustomers } from '../pages/admin/AdminCustomers';
import { AdminCategories } from '../pages/admin/AdminCategories';

const withAdminLayout = (children: React.ReactNode) => (
    <RequireAdmin>
        <AdminLayout>{children}</AdminLayout>
    </RequireAdmin>
);

export const adminRoutes: RouteObject[] = [
    { path: 'admin', element: withAdminLayout(<Dashboard />) },
    { path: 'admin/products', element: withAdminLayout(<AdminProducts />) },
    { path: 'admin/products/new', element: withAdminLayout(<AdminProductForm />) },
    { path: 'admin/products/:id/edit', element: withAdminLayout(<AdminProductForm />) },
    { path: 'admin/orders', element: withAdminLayout(<AdminOrders />) },
    { path: 'admin/customers', element: withAdminLayout(<AdminCustomers />) },
    { path: 'admin/categories', element: withAdminLayout(<AdminCategories />) },
];