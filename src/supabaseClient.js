import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tmvhmyequfhnwppqfqqe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5284TZx7qrllqN5ZsOvzGQ_BsJDpjGB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
