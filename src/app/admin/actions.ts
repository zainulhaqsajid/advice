'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type TabId = 'assessments' | 'bookings' | 'contacts' | 'cases' | 'messages';

const TABLE_MAP: Record<string, string> = {
  assessments: 'assessments',
  bookings: 'bookings',
  contacts: 'contact_inquiries',
  cases: 'client_cases',
  messages: 'messages',
};

const ALLOWED_TABLES = ['assessments', 'bookings', 'contact_inquiries', 'client_cases', 'client_documents', 'messages'];

const ALLOWED_FIELDS: Record<string, string[]> = {
  assessments: ['status'],
  bookings: ['status', 'payment_status', 'notes'],
  contact_inquiries: ['status'],
  client_cases: ['status', 'priority', 'assigned_agent', 'agent_email', 'notes'],
  client_documents: ['status', 'review_notes'],
  messages: ['is_read'],
};

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function verifyAgentRole(): Promise<{ authorized: boolean; userId?: string; role?: string; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return { authorized: false, error: 'Not authenticated' };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
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
    console.error('[Admin Action] verifyAgentRole error:', err);
    return { authorized: false, error: 'Auth verification failed' };
  }
}

export async function fetchAdminTab(tab: TabId): Promise<{ data?: unknown[]; warning?: string; error?: string }> {
  const { authorized, error: authError } = await verifyAgentRole();
  if (!authorized) {
    return { error: authError || 'Unauthorized. Agent or admin role required.' };
  }

  const admin = getAdminClient();
  const tableName = TABLE_MAP[tab];
  if (!tableName) {
    return { error: 'Invalid tab' };
  }

  const { data, error } = await admin
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    if (error.message?.includes('does not exist') || error.code === '42P01') {
      return { data: [], warning: `Table "${tableName}" does not exist yet. Run the SQL migration.` };
    }
    if (error.message?.includes('permission denied') || error.code === '42501') {
      return { data: [], warning: `Permission denied for "${tableName}". Check that SUPABASE_SERVICE_ROLE_KEY is correct.` };
    }
    return { error: error.message };
  }

  return { data: data || [] };
}

export async function updateAdminRecord(
  table: string,
  id: string,
  updates: Record<string, unknown>
): Promise<{ data?: unknown; error?: string }> {
  const { authorized } = await verifyAgentRole();
  if (!authorized) return { error: 'Unauthorized' };

  if (!ALLOWED_TABLES.includes(table)) return { error: 'Invalid table' };

  const filtered: Record<string, unknown> = {};
  for (const key of Object.keys(updates)) {
    if (ALLOWED_FIELDS[table]?.includes(key)) {
      filtered[key] = updates[key];
    }
  }
  if (Object.keys(filtered).length === 0) return { error: 'No valid fields to update' };

  const admin = getAdminClient();
  const { data, error } = await admin
    .from(table)
    .update(filtered)
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function replyToMessage(
  userId: string,
  caseId: string | null,
  subject: string | null,
  content: string
): Promise<{ message?: unknown; error?: string }> {
  const { authorized } = await verifyAgentRole();
  if (!authorized) return { error: 'Unauthorized' };

  if (!userId || !content?.trim()) return { error: 'user_id and content are required' };

  const admin = getAdminClient();
  const { data, error } = await admin
    .from('messages')
    .insert({
      user_id: userId,
      case_id: caseId || null,
      sender_type: 'agent',
      subject: subject || null,
      content: content.trim(),
      attachments: [],
      is_read: false,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { message: data };
}
