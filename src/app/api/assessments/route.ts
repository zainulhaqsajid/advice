import { NextResponse } from 'next/server';
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// POST /api/assessments - Submit a free visa assessment (lead capture)
// Uses admin client (service role) so anonymous users can insert without RLS issues
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, full_name, phone, situation, form_data, recommended_visa, points_score } = body as {
      email?: string; full_name?: string; phone?: string; situation: string;
      form_data?: Record<string, unknown>; recommended_visa?: string; points_score?: number;
    };

    if (!situation) {
      return NextResponse.json({ error: 'Situation is required' }, { status: 400 });
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

    // Use admin client to bypass RLS for lead capture
    const admin = await createAdminClient();

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
      console.error('[API /assessments POST] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ assessment: data }, { status: 201 });
  } catch (err) {
    console.error('[API /assessments POST] Unexpected error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/assessments - Fetch user's assessments
export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ assessments: data });
}
