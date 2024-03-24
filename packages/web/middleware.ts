import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/'],
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl

  // const hostname = request.headers.get('host')!
  // const replacedHostname = hostname.replace(
  //   '.localhost:3000',
  //   `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  // )

  // const searchParams = request.nextUrl.searchParams.toString()

  // const path = `${url.pathname}${
  //   searchParams.length > 0 ? `?${searchParams}` : ''
  // }`

  if (url.basePath === '' || url.basePath === '/') {
    return NextResponse.redirect(new URL(`/blog`, request.url))
  }

  return NextResponse.next()
}
