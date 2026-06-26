// src/routes/search.routes.tsx

import type { RouteObject } from 'react-router-dom';
import { Search } from '../pages/store/Search';

export const searchRoutes: RouteObject[] = [
    {
        path: 'search',
        element: <Search />,
    },
];