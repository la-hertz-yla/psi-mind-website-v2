const SUPABASE_URL = "https://uyhwwqlcophdvjgeucef.supabase.co"
const SUPABASE_KEY = "sb_publishable_zRLpgdEEluI8kwi_SzxBFg_mtQ-GSxH"

if (!window.supabase) {
    console.error("Supabase CDN not loaded!")
}

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
)
