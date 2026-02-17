import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// POST /api/contact - Submit a contact inquiry
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

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

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('contact_inquiries')
    .insert({
      user_id: user?.id ?? null,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inquiry: data, message: 'Inquiry submitted successfully' }, { status: 201 });
}
