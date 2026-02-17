-- =============================================
-- Client Portal Schema - Module 1 & 2
-- Documents, Cases, Messages + Assessment enhancements
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql
-- =============================================

-- 11. CLIENT CASES (application tracking)
CREATE TABLE IF NOT EXISTS public.client_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  case_number TEXT UNIQUE NOT NULL,
  visa_subclass TEXT NOT NULL,
  visa_name TEXT NOT NULL,
  status TEXT DEFAULT 'initial_consultation' CHECK (status IN (
    'initial_consultation', 'documents_collection', 'skills_assessment',
    'application_preparation', 'application_lodged', 'additional_info_requested',
    'health_checks', 'character_checks', 'decision_pending',
    'approved', 'refused', 'withdrawn', 'on_hold'
  )),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_agent TEXT,
  agent_email TEXT,
  lodgement_date DATE,
  decision_date DATE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CLIENT DOCUMENTS (upload/download)
CREATE TABLE IF NOT EXISTS public.client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.client_cases(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'identity', 'financial', 'employment', 'education',
    'relationship', 'health', 'character', 'english_test',
    'skills_assessment', 'other'
  )),
  description TEXT,
  uploaded_by TEXT DEFAULT 'client' CHECK (uploaded_by IN ('client', 'agent')),
  status TEXT DEFAULT 'uploaded' CHECK (status IN (
    'uploaded', 'reviewed', 'approved', 'rejected', 'requires_update'
  )),
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. MESSAGES (correspondence between client and agent)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.client_cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'agent', 'system')),
  subject TEXT,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CASE STATUS HISTORY (audit trail)
CREATE TABLE IF NOT EXISTS public.case_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.client_cases(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_client_cases_user_id ON public.client_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_client_cases_status ON public.client_cases(status);
CREATE INDEX IF NOT EXISTS idx_client_cases_number ON public.client_cases(case_number);
CREATE INDEX IF NOT EXISTS idx_client_documents_user_id ON public.client_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_case_id ON public.client_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_category ON public.client_documents(category);
CREATE INDEX IF NOT EXISTS idx_messages_case_id ON public.messages(case_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);
CREATE INDEX IF NOT EXISTS idx_case_status_history_case_id ON public.case_status_history(case_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.client_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_status_history ENABLE ROW LEVEL SECURITY;

-- CLIENT CASES: Users can view/create their own
CREATE POLICY "Users can view own cases" ON public.client_cases
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own cases" ON public.client_cases
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cases" ON public.client_cases
  FOR UPDATE USING (auth.uid() = user_id);

-- CLIENT DOCUMENTS: Users can CRUD their own
CREATE POLICY "Users can view own documents" ON public.client_documents
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload documents" ON public.client_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON public.client_documents
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.client_documents
  FOR DELETE USING (auth.uid() = user_id);

-- MESSAGES: Users can view messages for their cases
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can mark own messages read" ON public.messages
  FOR UPDATE USING (auth.uid() = user_id);

-- CASE STATUS HISTORY: Users can view for their cases
CREATE POLICY "Users can view own case history" ON public.case_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.client_cases
      WHERE client_cases.id = case_status_history.case_id
      AND client_cases.user_id = auth.uid()
    )
  );

-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER update_client_cases_updated_at
  BEFORE UPDATE ON public.client_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_client_documents_updated_at
  BEFORE UPDATE ON public.client_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-generate case number
CREATE OR REPLACE FUNCTION public.generate_case_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.case_number IS NULL OR NEW.case_number = '' THEN
    NEW.case_number := 'CASE-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(NEW.id::TEXT, 1, 6);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_case_number
  BEFORE INSERT ON public.client_cases
  FOR EACH ROW EXECUTE FUNCTION public.generate_case_number();

-- Auto-track case status changes
CREATE OR REPLACE FUNCTION public.track_case_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.case_status_history (case_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, 'system');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_case_status
  AFTER UPDATE ON public.client_cases
  FOR EACH ROW EXECUTE FUNCTION public.track_case_status_change();

-- =============================================
-- SUPABASE STORAGE BUCKET for documents
-- Run this separately in Supabase Dashboard > Storage
-- or via the Supabase management API
-- =============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('client-documents', 'client-documents', false);
-- CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can delete own documents" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
