import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase environment variables are missing. Using placeholder values for development.'
    );
}

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const supabase = (() => {
    if (!supabaseInstance) {
        const url = supabaseUrl || 'https://your-project-id.supabase.co';
        const key = supabaseAnonKey || 'your-anon-key';
        supabaseInstance = createClient<Database>(url, key);
    }
    return supabaseInstance;
})();