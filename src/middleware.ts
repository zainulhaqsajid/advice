import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch {
    // If session refresh fails, continue without blocking
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Match all paths except static files, images, and API routes
    // API routes handle their own auth — no need for middleware session refresh
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
