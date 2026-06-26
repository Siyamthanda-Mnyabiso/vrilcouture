import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';

import { storeRoutes } from './store.routes';
import { authRoutes } from './auth.routes';
import { adminRoutes } from './admin.routes';
import { accountRoutes } from './account.routes';
import { searchRoutes } from './search.routes';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            ...storeRoutes,
            ...authRoutes,
            ...adminRoutes,
            ...accountRoutes,
            ...searchRoutes,
        ],
    },
]);