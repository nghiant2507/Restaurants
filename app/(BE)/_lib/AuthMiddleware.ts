import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

type ApiHandler = (
  req: NextRequest,
  context: {
    params?: any;  //eslint-disable-line
    session: any;  //eslint-disable-line
  },
) => Promise<NextResponse>;

export enum AccessLevel {
  PUBLIC,
  AUTHENTICATED,
  ADMIN,
}

interface AuthWrapperOptions {
  accessLevel?: AccessLevel;
  requireRole?: string[];
}

export function withApiAuth(
  handler: ApiHandler,
  options: AuthWrapperOptions = {},
) {
  return async (req: NextRequest, context: any) => {  //eslint-disable-line
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 },
      );
    }

    const token = authHeader.split(' ')[1];

    // Tạo Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    try {
      // Verify token
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 },
        );
      }

      const session = {
        user: data.user,
        access_token: token,
      };

      // Kiểm tra mức truy cập
      switch (options.accessLevel) {
        case AccessLevel.PUBLIC:
          return handler(req, { ...context, session });

        case AccessLevel.AUTHENTICATED:
          if (!session.user) {
            return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 401 },
            );
          }
          break;

        case AccessLevel.ADMIN:
          if (!isAdmin(session)) {
            return NextResponse.json(
              { error: 'Access Denied' },
              { status: 403 },
            );
          }
          break;

        default:
          if (!session.user) {
            return NextResponse.json(
              { error: 'Authentication Required' },
              { status: 401 },
            );
          }
      }

      if (options.requireRole && session.user) {
        const hasRequiredRole = options.requireRole.some((role) =>
          hasRole(session, role),
        );

        if (!hasRequiredRole) {
          return NextResponse.json(
            { error: 'Insufficient Permissions' },
            { status: 403 },
          );
        }
      }

      // Gọi handler với session
      return handler(req, { ...context, session });
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication process failed' },
        { status: 500 },
      );
    }
  };
}

function isAdmin(session: any): boolean {  //eslint-disable-line
  return session?.user?.user_metadata?.role === 'ADMIN';
}

function hasRole(session: any, role: string): boolean {  //eslint-disable-line
  return session?.user?.user_metadata?.role === role;
}
//
// // Utility function for token extraction
// export function extractTokenFromHeader(req: NextRequest): string | null {
//   const authHeader = req.headers.get('authorization');
//   return authHeader ? authHeader.split(' ')[1] : null;
// }
