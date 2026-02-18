import { NextResponse } from 'next/server';
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server';

// POST /api/contact - Submit a contact inquiry
// Uses admin client (service role) so anonymous users can insert without RLS issues
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, inquiry_type, visa_category, message } = body as {
      full_name: string; email: string; phone?: string;
      inquiry_type: string; visa_category?: string; message: string;
    };

    if (!full_name || !email || !inquiry_type || !message) {
      return NextResponse.json(
        { error: 'Name, email, inquiry type, and message are required' },
        { status: 400 }
      );
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

    // Use admin client to bypass RLS for contact submissions
    const admin = await createAdminClient();

    const { data, error } = await admin
      .from('contact_inquiries')
      .insert({
        user_id: userId,
        full_name,
        email,
        phone: phone ?? null,
        inquiry_type,
        visa_category: visa_category ?? null,
        message,
      })
      .select()
      .single();

    if (error) {
      console.error('[API /contact POST] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ inquiry: data, message: 'Inquiry submitted successfully' }, { status: 201 });
  } catch (err) {
    console.error('[API /contact POST] Unexpected error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
