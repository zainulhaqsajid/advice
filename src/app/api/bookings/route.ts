import { NextResponse } from 'next/server';
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// POST /api/bookings - Create a consultation booking
// Uses admin client (service role) so anonymous users can insert without RLS issues
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, consultation_type, preferred_date, preferred_time, visa_category, notes } = body as {
      full_name: string; email: string; phone?: string; consultation_type: string;
      preferred_date: string; preferred_time: string; visa_category?: string; notes?: string;
    };

    if (!full_name || !email || !consultation_type || !preferred_date || !preferred_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validTypes = ['video', 'phone', 'in_person'];
    if (!validTypes.includes(consultation_type)) {
      return NextResponse.json({ error: 'Invalid consultation type' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Try to get authenticated user (optional)
    let userId: string | null = null;
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Anonymous user
    }

    const paymentAmounts: Record<string, number> = {
      video: 150,
      phone: 100,
      in_person: 200,
    };

    // Use admin client to bypass RLS for booking creation
    const admin = await createAdminClient();

    const { data, error } = await admin
      .from('bookings')
      .insert({
        user_id: userId,
        full_name,
        email,
        phone: phone || null,
        consultation_type,
        preferred_date,
        preferred_time,
        visa_category: visa_category || null,
        notes: notes || null,
        payment_amount: paymentAmounts[consultation_type] || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[API /bookings POST] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ booking: data }, { status: 201 });
  } catch (err) {
    console.error('[API /bookings POST] Unexpected error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/bookings - Fetch user's bookings
export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: data });
}
