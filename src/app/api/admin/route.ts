import { NextResponse, NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

async function verifyAdmin(supabaseAdmin: Awaited<ReturnType<typeof createAdminClient>>) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser();
  if (error || !user) return false;
  // Allow if email is in ADMIN_EMAILS, or if no ADMIN_EMAILS configured (first-run / dev)
  if (ADMIN_EMAILS.length === 0) return true;
  return ADMIN_EMAILS.includes(user.email || '');
}

// GET /api/admin?tab=assessments|bookings|contacts|cases|messages
export async function GET(request: NextRequest) {
  const supabase = await createAdminClient();

  const isAdmin = await verifyAdmin(supabase);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tab = request.nextUrl.searchParams.get('tab') || 'assessments';

  try {
    switch (tab) {
      case 'assessments': {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (error) throw error;
        return NextResponse.json({ data });
      }
      case 'bookings': {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (error) throw error;
        return NextResponse.json({ data });
      }
      case 'contacts': {
        const { data, error } = await supabase
          .from('contact_inquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (error) throw error;
        return NextResponse.json({ data });
      }
      case 'cases': {
        const { data, error } = await supabase
          .from('client_cases')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (error) throw error;
        return NextResponse.json({ data });
      }
      case 'messages': {
        const { data, error } = await supabase
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

// PATCH /api/admin - Update status of any record
export async function PATCH(request: Request) {
  const supabase = await createAdminClient();

  const isAdmin = await verifyAdmin(supabase);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  // Whitelist allowed fields per table
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

  const { data, error } = await supabase
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
