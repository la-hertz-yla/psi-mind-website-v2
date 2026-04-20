
// Initialisation de Supabase
// Remplacez ces valeurs par vos propres clés Supabase si elles changent
const SUPABASE_URL = "https://uyhwwqlcophdvjgeucef.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5aHd3cWxjb3BoZHZqZ2V1Y2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDU2NjIsImV4cCI6MjA5MjE4MTY2Mn0.ecDNU4OyjbqP6PFclRzHd7OXGVP1eugGw-29mLdoDXc"

// Création du client global
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Exportation globale pour garantir l'accès depuis tous les scripts
window.supabaseClient = supabase;
