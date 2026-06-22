import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL ??
    'https://juqasjgenypikmpilfjz.supabase.co';

const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cWFzamdlbnlwaWttcGlsZmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5ODMwODEsImV4cCI6MjA5NzU1OTA4MX0.J11uAuMuqVwTWYgSI3tiYea2TgHENlxKKgfeJHjDFnM';

export const supabase = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey
);