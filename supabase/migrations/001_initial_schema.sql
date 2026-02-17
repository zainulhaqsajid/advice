-- =============================================
-- Australian PR Pathway Tool - Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =============================================

-- 1. USER PROFILES (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  auth_provider TEXT DEFAULT 'email',
  nationality TEXT,
  current_visa TEXT,
  target_visa TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SAVED REPORTS (checklists, cost estimates, timelines, intake results)
CREATE TABLE IF NOT EXISTS public.saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('checklist', 'cost', 'timeline', 'intake', 'points')),
  title TEXT NOT NULL,
  pathway TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ASSESSMENTS (free visa assessment - lead capture)
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  situation TEXT NOT NULL,
  form_data JSONB DEFAULT '{}',
  recommended_visa TEXT,
  points_score INTEGER,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTACT INQUIRIES
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('general', 'visa_specific', 'consultation', 'complaint', 'feedback')),
  visa_category TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONSULTATION BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  consultation_type TEXT NOT NULL CHECK (consultation_type IN ('video', 'phone', 'in_person')),
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  visa_category TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_amount DECIMAL(10, 2),
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BLOG POSTS
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  featured_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 7. TESTIMONIALS / CLIENT REVIEWS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  visa_category TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  country_of_origin TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. OCCUPATIONS DATABASE (SOL/CSOL)
CREATE TABLE IF NOT EXISTS public.occupations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anzsco_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assessing_authority TEXT,
  eligible_visas TEXT[] DEFAULT '{}',
  skill_level INTEGER,
  on_mltssl BOOLEAN DEFAULT FALSE,
  on_stsol BOOLEAN DEFAULT FALSE,
  on_rol BOOLEAN DEFAULT FALSE,
  state_nominations JSONB,
  last_invitation_round JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INVITATION ROUNDS (SkillSelect data)
CREATE TABLE IF NOT EXISTS public.invitation_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_date DATE NOT NULL,
  visa_subclass TEXT NOT NULL,
  occupation_group TEXT,
  anzsco_code TEXT,
  invitations_issued INTEGER NOT NULL,
  minimum_points INTEGER,
  latest_doe DATE,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. STATE NOMINATION REQUIREMENTS
CREATE TABLE IF NOT EXISTS public.state_nominations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code TEXT NOT NULL,
  state_name TEXT NOT NULL,
  visa_subclass TEXT NOT NULL,
  requirements JSONB DEFAULT '{}',
  occupation_list_url TEXT,
  is_open BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(state_code, visa_subclass)
);

-- =============================================
-- INDEXES for performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_saved_reports_user_id ON public.saved_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_email ON public.assessments(email);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.assessments(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON public.contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON public.testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_occupations_anzsco ON public.occupations(anzsco_code);
CREATE INDEX IF NOT EXISTS idx_invitation_rounds_date ON public.invitation_rounds(round_date);
CREATE INDEX IF NOT EXISTS idx_state_nominations_state ON public.state_nominations(state_code);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occupations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.state_nominations ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- SAVED REPORTS: Users can CRUD their own reports
CREATE POLICY "Users can view own reports" ON public.saved_reports
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own reports" ON public.saved_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reports" ON public.saved_reports
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reports" ON public.saved_reports
  FOR DELETE USING (auth.uid() = user_id);

-- ASSESSMENTS: Anyone can create (lead capture), users can view own
CREATE POLICY "Anyone can create assessment" ON public.assessments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own assessments" ON public.assessments
  FOR SELECT USING (auth.uid() = user_id);

-- CONTACT INQUIRIES: Anyone can create
CREATE POLICY "Anyone can create inquiry" ON public.contact_inquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own inquiries" ON public.contact_inquiries
  FOR SELECT USING (auth.uid() = user_id);

-- BOOKINGS: Users can view/create their own
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create booking" ON public.bookings
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- BLOG POSTS: Public read for published posts
CREATE POLICY "Anyone can read published posts" ON public.blog_posts
  FOR SELECT USING (published = true);

-- TESTIMONIALS: Public read for approved testimonials, anyone can create
CREATE POLICY "Anyone can read approved testimonials" ON public.testimonials
  FOR SELECT USING (approved = true);
CREATE POLICY "Anyone can submit testimonial" ON public.testimonials
  FOR INSERT WITH CHECK (true);

-- OCCUPATIONS: Public read
CREATE POLICY "Anyone can read occupations" ON public.occupations
  FOR SELECT USING (true);

-- INVITATION ROUNDS: Public read
CREATE POLICY "Anyone can read invitation rounds" ON public.invitation_rounds
  FOR SELECT USING (true);

-- STATE NOMINATIONS: Public read
CREATE POLICY "Anyone can read state nominations" ON public.state_nominations
  FOR SELECT USING (true);

-- =============================================
-- FUNCTION: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- FUNCTION: Auto-update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_saved_reports_updated_at
  BEFORE UPDATE ON public.saved_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
