
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://uazcmusqroaxpgndzvqe.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhemNtdXNxcm9heHBnbmR6dnFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDQyMzEsImV4cCI6MjA1NzM4MDIzMX0.vt44-64REGzxEYaIYBMdxXptzNeUUUYPK63lREjtMfQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
