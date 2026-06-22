/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string;
    readonly VITE_YOCO_PUBLIC_KEY: string;
    readonly VITE_YOCO_SECRET_KEY: string;
    readonly VITE_YOCO_WEBHOOK_SECRET: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}