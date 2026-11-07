// src/pages/Unavailable.tsx
import { Link } from 'react-router-dom';

export function Unavailable() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-2xl font-medium uppercase tracking-wider mb-4">
                Temporarily unavailable
            </h1>
            <p className="text-sm max-w-md mb-8">
                This part of the site is temporarily unavailable. Please check back soon.
            </p>
            <Link
                to="/"
                className="text-sm font-medium uppercase tracking-wider underline hover:opacity-60 transition-opacity"
            >
                Back to home
            </Link>
        </div>
    );
}
