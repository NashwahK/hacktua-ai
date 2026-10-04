// src/lib/supabase.ts
//
// Anonymous-only auth for the public demo. The backend's get_current_user
// (app/auth.py) just verifies the JWT is real and reads the user id off
// it -- it has no concept of "anonymous" vs "registered," so Supabase's
// anonymous sign-in (one call, no email/password, no UI) is enough to
// get a valid session and unblock every authenticated endpoint.
//
// Requires "Anonymous Sign-ins" enabled in the Supabase dashboard
// (Authentication -> Providers) -- off by default.

import { createClient, type Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly at build/runtime rather than silently sending
  // unauthenticated requests that the backend will 401 on.
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY -- ' +
    'the assessment demo cannot authenticate without these.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

let anonSessionPromise: Promise<Session | null> | null = null;

// Signs in anonymously exactly once per page load (subsequent calls reuse
// the in-flight/completed promise), and reuses an existing session if one
// is already live rather than creating a fresh anonymous user every call.
export function ensureAnonSession(): Promise<Session | null> {
  if (!anonSessionPromise) {
    anonSessionPromise = (async () => {
      const { data: existing } = await supabase.auth.getSession();
      if (existing.session) return existing.session;

      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('Anonymous sign-in failed:', error.message);
        return null;
      }
      return data.session;
    })();
  }
  return anonSessionPromise;
}

export async function getAccessToken(): Promise<string | null> {
  const session = await ensureAnonSession();
  return session?.access_token ?? null;
}