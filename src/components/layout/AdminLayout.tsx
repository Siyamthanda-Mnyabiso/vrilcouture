import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
            return;
        }

        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, loading, navigate]);


    if (loading) {
        return (
            <div className="
                min-h-screen
                bg-[#FAFAF8]
                flex
                items-center
                justify-center
            ">
                <div className="
                    w-10
                    h-10
                    border
                    border-black/20
                    border-t-black
                    rounded-full
                    animate-spin
                " />
            </div>
        );
    }


    if (!user || user.role !== 'admin') {
        return null;
    }


    return (
        <div className="
            flex
            min-h-screen
            bg-[#FAFAF8]
            text-black
        ">

            <AdminSidebar isOpen={true} />

            <main className="
                flex-1
                overflow-auto
                bg-[#FAFAF8]
            ">
                <div className="
                    min-h-screen
                    border-l
                    border-black/5
                ">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};