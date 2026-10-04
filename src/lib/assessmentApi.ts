// src/lib/assessmentApi.ts
//
// Direct port of the mobile app's src/api/sessions.js. Same backend
// (Railway), same endpoints, same request/response shapes -- this demo
// is the real assessment engine, not a simulation. Only the auth source
// differs (anonymous Supabase session instead of a signed-up user's).

import { getAccessToken } from './supabase';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

async function getHeaders(): Promise<HeadersInit> {
  const token = await getAccessToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const headers = await getHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err}`);
  }
  return res.json();
}

export interface CreateSessionResponse {
  session_id: string;
  first_question_id: string;
}

export function createSession(seedText: string): Promise<CreateSessionResponse> {
  return post('/sessions/', { seed_text: seedText || null });
}

export interface ConditionScore {
  condition_id: string;
  raw_score: number;
  max_possible_score: number;
  confidence_score: number;
  confidence_band: string;
  mandatory_criteria_met: boolean;
}

export interface Report {
  conditions: ConditionScore[];
}

export interface SubmitResponseResult {
  next_question_id: string | null;
  session_complete: boolean;
  reason: string | null;
  report: Report;
}

export function submitResponse(args: {
  sessionId: string;
  questionId: string;
  rawValue: string;
  responseType: string;
}): Promise<SubmitResponseResult> {
  return post(`/sessions/${args.sessionId}/responses`, {
    session_id: args.sessionId,
    question_id: args.questionId,
    raw_value: String(args.rawValue),
    response_type: args.responseType,
  });
}