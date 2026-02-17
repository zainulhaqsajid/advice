import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// POST /api/assessments - Submit a free visa assessment (lead capture)
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const body = await request.json();
  const { email, full_name, phone, situation, form_data, recommended_visa, points_score } = body as {
    email?: string; full_name?: string; phone?: string; situation: string;
    form_data?: Record<string, unknown>; recommended_visa?: string; points_score?: number;
  };

  if (!situation) {
    return NextResponse.json({ error: 'Situation is required' }, { status: 400 });
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('assessments')
    .insert({
      user_id: user?.id ?? null,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ assessment: data }, { status: 201 });
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
