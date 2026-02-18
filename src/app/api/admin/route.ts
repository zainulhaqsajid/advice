import { NextResponse, NextRequest, connection } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

// Create a Supabase client using cookies from the request (avoids next/headers cookies())
function createRequestSupabaseClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // No-op in API routes
        },
      },
    }
  );
}

// Admin client — service role key, no cookies needed
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // Validate service role key isn't the anon key
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString());
    if (payload.role !== 'service_role') {
      console.error('[API /admin] SUPABASE_SERVICE_ROLE_KEY is not a service_role key! Current role:', payload.role);
    }
  } catch {
    // Ignore decode errors
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Verify that the current session user has agent or admin role
async function verifyAgentRole(request: NextRequest): Promise<{ authorized: boolean; userId?: string; role?: string; error?: string }> {
  try {
    const supabase = createRequestSupabaseClient(request);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return { authorized: false, error: 'Not authenticated' };

    // Use the user's own authenticated session to read their profile (works with RLS)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('[API /admin] Profile query error:', profileError.message);
      // Fallback: try admin client
      try {
        const admin = getAdminClient();
        const { data: adminProfile } = await admin
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const role = adminProfile?.role || 'client';
        if (role === 'agent' || role === 'admin') {
          return { authorized: true, userId: user.id, role };
        }
      } catch {
        // Admin client also failed
      }
      return { authorized: false, error: `Profile lookup failed: ${profileError.message}` };
    }

    const role = profile?.role || 'client';
    if (role === 'agent' || role === 'admin') {
      return { authorized: true, userId: user.id, role };
    }

    return { authorized: false, error: `Role "${role}" is not authorized. Need "agent" or "admin".` };
  } catch (err) {
    console.error('[API /admin] verifyAgentRole error:', err);
    return { authorized: false, error: 'Auth verification failed' };
  }
}

// GET /api/admin?tab=assessments|bookings|contacts|cases|messages
export async function GET(request: NextRequest) {
  await connection();
  try {
    const { authorized, error: authError } = await verifyAgentRole(request);
    if (!authorized) {
      return NextResponse.json(
        { error: authError || 'Unauthorized. Agent or admin role required.' },
        { status: 401 }
      );
    }

    const admin = getAdminClient();
    const tab = request.nextUrl.searchParams.get('tab') || 'assessments';

    const tableMap: Record<string, string> = {
      assessments: 'assessments',
      bookings: 'bookings',
      contacts: 'contact_inquiries',
      cases: 'client_cases',
      messages: 'messages',
    };

    const tableName = tableMap[tab];
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
    }

    const { data, error } = await admin
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error(`[API /admin GET] tab=${tab} error:`, error);
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        return NextResponse.json({ data: [], warning: `Table "${tableName}" does not exist yet. Run the SQL migration.` });
      }
      // Check if it's a permission error (wrong service role key)
      if (error.message?.includes('permission denied') || error.code === '42501') {
        return NextResponse.json({
          data: [],
          warning: `Permission denied for "${tableName}". Check that SUPABASE_SERVICE_ROLE_KEY in .env.local is the correct service_role key (not the anon key).`,
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error('[API /admin GET] Unexpected error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin - Agent actions (e.g., reply to message)
export async function POST(request: NextRequest) {
  await connection();
  try {
    const { authorized, userId } = await verifyAgentRole(request);
    if (!authorized || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getAdminClient();
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
  } catch (err) {
    console.error('[API /admin POST] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin - Update status of any record
export async function PATCH(request: NextRequest) {
  await connection();
  try {
    const { authorized } = await verifyAgentRole(request);
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getAdminClient();
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
  } catch (err) {
    console.error('[API /admin PATCH] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
