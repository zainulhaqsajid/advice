-- =============================================
-- Migration 003: Add role column to profiles for MARA agent access
-- Run this in Supabase SQL Editor
-- =============================================

-- Add role column to profiles (default 'client' for all existing users)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client'
  CHECK (role IN ('client', 'agent', 'admin'));

-- Index for fast role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- =============================================
-- To make a user an agent/admin, run:
-- UPDATE public.profiles SET role = 'agent' WHERE email = 'your-agent@email.com';
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
-- =============================================
