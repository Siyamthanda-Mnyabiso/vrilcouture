// src/routes/account.routes.tsx

import type { RouteObject } from 'react-router-dom';
import { AccountLayout } from '../pages/account/AccountLayout';
import Profile from '../pages/account/Profile';
import AccountOrders from '../pages/account/Orders';
import Addresses from '../pages/account/Addresses';

export const accountRoutes: RouteObject[] = [
    {
        path: 'account',
        element: <AccountLayout />,
        children: [
            {
                index: true,
                element: <Profile />,
            },
            {
                path: 'orders',
                element: <AccountOrders />,
            },
            {
                path: 'addresses',
                element: <Addresses />,
            },
        ],
    },
];