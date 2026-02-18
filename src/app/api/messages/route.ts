import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET /api/messages - Fetch user's messages
export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get('case_id');

  let query = supabase
    .from('messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (caseId) {
    query = query.eq('case_id', caseId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data });
}

// POST /api/messages - Send a new message
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { case_id, subject, content } = body as {
    case_id?: string; subject?: string; content: string;
  };

  if (!content || !content.trim()) {
    return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
  }

  // If case_id provided, verify the user owns the case
  if (case_id) {
    const { data: caseData } = await supabase
      .from('client_cases')
      .select('id')
      .eq('id', case_id)
      .eq('user_id', user.id)
      .single();

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      user_id: user.id,
      case_id: case_id || null,
      sender_type: 'client',
      subject: subject || null,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: data }, { status: 201 });
}

// PATCH /api/messages - Mark messages as read
export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { message_ids } = body as { message_ids: string[] };

  if (!message_ids || message_ids.length === 0) {
    return NextResponse.json({ error: 'Message IDs required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .in('id', message_ids)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
