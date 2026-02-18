import { NextResponse, NextRequest } from 'next/server';
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server';

// Verify that the current session user has agent or admin role
async function verifyAgentRole(): Promise<{ authorized: boolean; userId?: string; role?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return { authorized: false };

    // Look up the user's role from profiles using admin client (bypasses RLS)
    const admin = await createAdminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'client';
    if (role === 'agent' || role === 'admin') {
      return { authorized: true, userId: user.id, role };
    }

    return { authorized: false };
  } catch {
    return { authorized: false };
  }
}

// GET /api/admin?tab=assessments|bookings|contacts|cases|messages
export async function GET(request: NextRequest) {
  const { authorized } = await verifyAgentRole();
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized. Agent or admin role required.' }, { status: 401 });
  }

  const admin = await createAdminClient();
  const tab = request.nextUrl.searchParams.get('tab') || 'assessments';

  try {
    switch (tab) {
      case 'assessments': {
        const { data, error } = await admin
          .from('assessments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (error) throw error;
        return NextResponse.json({ data });
      }
      case 'bookings': {
        const { data, error } = await admin
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (error) throw error;
        return NextResponse.json({ data });
      }
      case 'contacts': {
        const { data, error } = await admin
          .from('contact_inquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (error) throw error;
        return NextResponse.json({ data });
      }
      case 'cases': {
        const { data, error } = await admin
          .from('client_cases')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (error) throw error;
        return NextResponse.json({ data });
      }
      case 'messages': {
        const { data, error } = await admin
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (error) throw error;
        return NextResponse.json({ data });
      }
      default:
        return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin - Agent actions (e.g., reply to message)
export async function POST(request: Request) {
  const { authorized, userId } = await verifyAgentRole();
  if (!authorized || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = await createAdminClient();
  const body = await request.json();
  const { action } = body as { action: string };

  if (action === 'reply_message') {
    const { user_id, case_id, subject, content } = body as {
      user_id: string; case_id?: string; subject?: string; content: string;
    };

    if (!user_id || !content?.trim()) {
      return NextResponse.json({ error: 'user_id and content are required' }, { status: 400 });
    }

    const { data, error } = await admin
      .from('messages')
      .insert({
        user_id,
        case_id: case_id || null,
        sender_type: 'agent',
        subject: subject || null,
        content: content.trim(),
        attachments: [],
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: data }, { status: 201 });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

// PATCH /api/admin - Update status of any record
export async function PATCH(request: Request) {
  const { authorized } = await verifyAgentRole();
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = await createAdminClient();
  const body = await request.json();
  const { table, id, updates } = body as {
    table: string;
    id: string;
    updates: Record<string, unknown>;
  };

  if (!table || !id || !updates) {
    return NextResponse.json({ error: 'table, id, and updates are required' }, { status: 400 });
  }

  const allowedTables = ['assessments', 'bookings', 'contact_inquiries', 'client_cases', 'client_documents', 'messages'];
  if (!allowedTables.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const allowedFields: Record<string, string[]> = {
    assessments: ['status'],
    bookings: ['status', 'payment_status', 'notes'],
    contact_inquiries: ['status'],
    client_cases: ['status', 'priority', 'assigned_agent', 'agent_email', 'notes'],
    client_documents: ['status', 'review_notes'],
    messages: ['is_read'],
  };

  const filtered: Record<string, unknown> = {};
  for (const key of Object.keys(updates)) {
    if (allowedFields[table]?.includes(key)) {
      filtered[key] = updates[key];
    }
  }

  if (Object.keys(filtered).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data, error } = await admin
    .from(table)
    .update(filtered)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
