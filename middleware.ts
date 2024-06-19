import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from './lib/constant';

const protectedRoutes = [HOME_ROUTE.replace('/*', '')]; // Adjust to match base path

export async function middleware(request: NextRequest) {
  // Exclude static file requests
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || '';

  console.log('Session:', session);
  console.log('Request Path:', request.nextUrl.pathname);

  if (!session && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    console.log('No session and trying to access protected route:', request.nextUrl.pathname);
    const absoluteURL = new URL(ROOT_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  if (session && request.nextUrl.pathname === ROOT_ROUTE) {
    console.log('Has session and trying to access root route');
    const absoluteURL = new URL(HOME_ROUTE.replace('/*', ''), request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next();
}
