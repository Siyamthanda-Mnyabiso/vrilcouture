import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../ui/Loader';

export function AdminRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}