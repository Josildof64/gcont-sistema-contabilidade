const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfig = url && anonKey ? { url, anonKey } : null;

/** Cliente REST mínimo para a primeira integração. Nunca use a service_role key no navegador. */
export async function supabaseRequest(path: string, init: RequestInit = {}) {
  if (!supabaseConfig) throw new Error("Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  const response = await fetch(`${supabaseConfig.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${supabaseConfig.anonKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!response.ok) throw new Error(`Erro Supabase: ${response.status}`);
  return response.status === 204 ? null : response.json();
}
