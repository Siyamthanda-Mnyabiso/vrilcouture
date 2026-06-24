// src/routes/admin.routes.tsx
import type { RouteObject } from 'react-router-dom';
import { RequireAdmin } from '../components/auth/RequireAdmin';
import { AdminProducts } from '../pages/admin/AdminProducts';
import { AdminProductForm } from '../pages/admin/AdminProductForm';

export const adminRoutes: RouteObject[] = [
    {
        path: 'admin/products',
        element: (
            <RequireAdmin>
                <AdminProducts />
            </RequireAdmin>
        ),
    },
    {
        path: 'admin/products/new',
        element: (
            <RequireAdmin>
                <AdminProductForm />
            </RequireAdmin>
        ),
    },
    {
        path: 'admin/products/:id/edit',
        element: (
            <RequireAdmin>
                <AdminProductForm />
            </RequireAdmin>
        ),
    },
];