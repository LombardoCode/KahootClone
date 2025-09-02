// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ROUTES } from "./app/utils/Routes/routesUtils";

const PUBLIC_PATHS: (string | RegExp)[] = [
  '/'
];

const AUTH_PATHS: string[] = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.SIGNUP,
  ROUTES.AUTH.FORGOT_PASSWORD,
  ROUTES.AUTH.RESET_PASSWORD
];

const PUBLIC_GAMEPLAY_PATHS: (string | RegExp)[] = [
  /^\/lobby\/\d+$/,
  '/start',
  '/getready',
  '/gameblock',
  '/result',
  '/gameover',
  '/ranking'
];

const isPublicPath = (pathname: string): boolean => {
  return [...PUBLIC_PATHS, ...PUBLIC_GAMEPLAY_PATHS].some(path =>
    typeof path === 'string'
      ? path === pathname
      : path.test(pathname)
  );
}

const isAuthPath = (pathname: string): boolean => {
  return AUTH_PATHS.some(ap => ap === pathname);
}

const verifyToken = async (token: string | null | undefined): Promise<boolean> => {
  if (!token) {
    return false;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS512'], // JWT signing algorithm (see AuthService.cs/GenerateJwtToken)
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    });

    const currentTime = Math.floor(Date.now() / 1000);

    // Token is not valid yet
    if (payload.nbf && currentTime < payload.nbf) {
      return false;
    }

    // Token has expired
    if (payload.exp && currentTime > payload.exp) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

export const middleware = async (req: NextRequest): Promise<NextResponse> => {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get('auth-token')?.value;
  const isValid = await verifyToken(token);

  if (isAuthPath(pathname)) {
    if (isValid) {
      const dashboardUrl: URL = new URL(ROUTES.MENU.DISCOVERY, req.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  }

  if (!isValid) {
    const loginUrl: URL = new URL(ROUTES.AUTH.LOGIN, req.url);

    const response: NextResponse = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth-token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|_static|_vercel|.*\\..*).*)',
  ],
};
