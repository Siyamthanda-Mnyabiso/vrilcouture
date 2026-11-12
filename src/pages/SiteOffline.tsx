// src/pages/SiteOffline.tsx
// Full holding page, shown for every URL when VITE_SITE_OFFLINE=true.
export function SiteOffline() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
            <h1 className="text-2xl font-medium uppercase tracking-[0.3em] mb-6">
                Temporarily offline
            </h1>
            <p className="text-sm max-w-md">
                This website is temporarily offline. Please check back soon.
            </p>
        </div>
    );
}
