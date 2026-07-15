// src/routes/store.routes.tsx
import type { RouteObject } from 'react-router-dom';
import { Home } from '../pages/store/Home';
import { Shop } from '../pages/store/Shop';
import { ProductDetails } from '../pages/store/ProductDetails';
import { CategoryDetails } from '../pages/store/CategoryDetails';
import { Cart } from '../pages/store/Cart';
import { Checkout } from '../pages/store/Checkout';
import { OrderSuccess } from '../pages/store/OrderSuccess';
import { About } from '../pages/store/About';
import { Contact } from '../pages/store/Contact';
import { Terms } from '../pages/store/Terms';
import { ReturnPolicy } from '../pages/store/ReturnPolicy';

export const storeRoutes: RouteObject[] = [
    {
        index: true,
        element: <Home />,
    },
    {
        path: 'shop',
        element: <Shop />,
    },
    {
        path: 'about',
        element: <About />,
    },
    {
        path: 'contact',
        element: <Contact />,
    },
    {
        path: 'terms',
        element: <Terms />,
    },
    {
        path: 'returns',
        element: <ReturnPolicy />,
    },
    {
        path: 'product/:slug',
        element: <ProductDetails />,
    },
    {
        path: 'category/:slug',
        element: <CategoryDetails />,
    },
    {
        path: 'cart',
        element: <Cart />,
    },
    {
        path: 'checkout',
        element: <Checkout />,
    },
    {
        path: 'order-success',
        element: <OrderSuccess />,
    },
];