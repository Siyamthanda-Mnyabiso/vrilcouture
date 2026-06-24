// src/components/layout/AdminLayout.tsx
import type { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex min-h-[calc(100vh-1px)] bg-white">
            <AdminSidebar />
            <div className="flex-1 px-8 py-8">{children}</div>
        </div>
    );
};