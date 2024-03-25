import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'
import { getUserInfo } from "./lib/utils";

export async function middleware(request: NextRequest) {
    const user = await getUserInfo(request)

    if (!Object.keys(user ?? {}).length) {
        if (['/login', '/signup'].includes(request.nextUrl.pathname)) {
            return NextResponse.next()
        } else {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (Object.keys(user ?? {}).length) {
        if (!user.is_verified) {
            if (request.nextUrl.pathname !== '/verify-email') {
                return NextResponse.redirect(new URL('/verify-email', request.url))
            }
        }
        if (['/login', '/signup',].includes(request.nextUrl.pathname) || ((user.is_verified) && ['/verify-email'].includes(request.nextUrl.pathname))) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }
}


export const config = {
    matcher: [
        '/((?!api|_next/static|favicon.ico).*)',
    ],

}