import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client for middleware
function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth') ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/reset-password' ||
    pathname === '/' ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next()
  }

  try {
    const supabase = createSupabaseClient()
    
    // Get session from request headers or cookies
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('sb-access-token')?.value

    if (!token) {
      // No token found, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify the token
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if accessing a specific PDF file
    if (pathname.startsWith('/pdf/')) {
      const fileId = pathname.split('/')[2]
      
      if (fileId && fileId !== 'upload') {
        // Check if user has access to this file
        const { data: fileData, error: fileError } = await supabase
          .from('pdf_files')
          .select('user_id')
          .eq('id', fileId)
          .single()

        if (fileError || !fileData) {
          // File not found
          return NextResponse.redirect(new URL('/404', request.url))
        }

        if (fileData.user_id !== user.id) {
          // User doesn't own this file
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }
    }

    // User is authenticated and authorized, continue
    const response = NextResponse.next()
    
    // Add user info to headers for use in components
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-email', user.email || '')
    
    return response

  } catch (error) {
    console.error('Middleware error:', error)
    
    // On error, redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|auth|login|signup|reset-password).*)',
  ],
}
