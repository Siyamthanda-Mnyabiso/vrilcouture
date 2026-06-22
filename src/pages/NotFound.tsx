import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-gray-600 mb-6">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
                Go Home
            </Link>
        </div>
    );
};