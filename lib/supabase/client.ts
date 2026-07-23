const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfig = url && anonKey ? { url, anonKey } : null;
export type Session = { access_token: string; user: { id: string; email?: string } };

function authHeaders(token?: string, extra: HeadersInit = {}) {
  if (!supabaseConfig) throw new Error("Configure o Supabase na Vercel.");
  return { apikey: supabaseConfig.anonKey, Authorization: `Bearer ${token ?? supabaseConfig.anonKey}`, "Content-Type": "application/json", ...extra };
}

async function parse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? data.error_description ?? "Não foi possível concluir esta operação.");
  return data;
}

export async function signIn(email: string, password: string): Promise<Session> {
  if (!supabaseConfig) throw new Error("O banco ainda não foi configurado.");
  return parse(await fetch(`${supabaseConfig.url}/auth/v1/token?grant_type=password`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ email, password }) }));
}

export async function signUp(email: string, password: string, fullName: string) {
  if (!supabaseConfig) throw new Error("O banco ainda não foi configurado.");
  return parse(await fetch(`${supabaseConfig.url}/auth/v1/signup`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ email, password, data: { full_name: fullName } }) }));
}

export async function request<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  if (!supabaseConfig) throw new Error("O banco ainda não foi configurado.");
  return parse(await fetch(`${supabaseConfig.url}/rest/v1/${path}`, { ...init, headers: authHeaders(token, { Prefer: "return=representation", ...init.headers }) }));
}
