import { NextResponse } from 'next/server'

export default function middleware(req: any) {
  // Security: Path traversal protection - block requests with .. sequences
  if (req.nextUrl.pathname.includes('..')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // No redirects needed - root path now shows content
}

export const config = {
  matcher: [
    // Skip Next.js internals and common static file types
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Include API routes
    '/(api|trpc)(.*)',
  ],
}