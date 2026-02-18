import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/documents - Fetch user's documents
export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('client_documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ documents: data });
}

// POST /api/documents - Create document record (after upload to storage)
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { file_name, file_type, file_size, storage_path, category, description, case_id } = body as {
    file_name: string; file_type: string; file_size: number; storage_path: string;
    category: string; description?: string; case_id?: string;
  };

  if (!file_name || !file_type || !file_size || !storage_path || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const validCategories = ['identity', 'financial', 'employment', 'education', 'relationship', 'health', 'character', 'english_test', 'skills_assessment', 'other'];
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('client_documents')
    .insert({
      user_id: user.id,
      case_id: case_id || null,
      file_name,
      file_type,
      file_size,
      storage_path,
      category,
      description: description || null,
      uploaded_by: 'client',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ document: data }, { status: 201 });
}

// DELETE /api/documents?id=xxx - Delete a document
export async function DELETE(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const docId = searchParams.get('id');

  if (!docId) {
    return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
  }

  // Get the document first to delete from storage
  const { data: doc } = await supabase
    .from('client_documents')
    .select('storage_path')
    .eq('id', docId)
    .eq('user_id', user.id)
    .single();

  if (doc) {
    // Delete from storage
    await supabase.storage.from('client-documents').remove([doc.storage_path]);
  }

  // Delete the record
  const { error } = await supabase
    .from('client_documents')
    .delete()
    .eq('id', docId)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
