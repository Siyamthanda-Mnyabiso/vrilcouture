import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { AuthProvider } from './context/AuthContext';
import { Analytics } from '@vercel/analytics/react';
import { featureFlags } from './lib/featureFlags';
import { SiteOffline } from './pages/SiteOffline';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {featureFlags.siteOffline ? (
            <SiteOffline />
        ) : (
            <AuthProvider>
                <RouterProvider router={router} />
                <Analytics />
            </AuthProvider>
        )}
    </StrictMode>
);
