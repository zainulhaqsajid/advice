'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function submitAssessment(payload: {
  situation: string;
  email?: string;
  full_name?: string;
  phone?: string;
  form_data?: Record<string, unknown>;
  recommended_visa?: string;
  points_score?: number;
}): Promise<{ assessment?: unknown; error?: string }> {
  const { situation, email, full_name, phone, form_data, recommended_visa, points_score } = payload;

  if (!situation) {
    return { error: 'Situation is required' };
  }

  // Try to get authenticated user (optional)
  let userId: string | null = null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // Anonymous user - that's fine
  }

  const admin = getAdminClient();

  const { data, error } = await admin
    .from('assessments')
    .insert({
      user_id: userId,
      email: email ?? null,
      full_name: full_name ?? null,
      phone: phone ?? null,
      situation,
      form_data: form_data ?? {},
      recommended_visa: recommended_visa ?? null,
      points_score: points_score ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('[Assessment Action] Supabase error:', error);
    return { error: error.message };
  }

  return { assessment: data };
}
