import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';

import { storeRoutes } from './store.routes';
import { authRoutes } from './auth.routes';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            ...storeRoutes,
            ...authRoutes,
        ],
    },
]);