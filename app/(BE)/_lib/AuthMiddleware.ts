import { createClient, User } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

type ApiHandler = (
  req: NextRequest,
  context: {
    params: Promise<any>; //eslint-disable-line
    session: {
      user: User;
      access_token?: string;
    };
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
  options: AuthWrapperOptions = {}, //eslint-disable-line
) {
  return async (req: NextRequest, context: { params: Promise<any> }) => {//eslint-disable-line
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 },
      );
    }

    const token = authHeader.split(' ')[1];
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 },
        );
      }

      return handler(req, {
        params: context.params,
        session: {
          user: data.user,
          access_token: token,
        },
      });
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication process failed' },
        { status: 500 },
      );
    }
  };
}

// Comment out permission check functions
// function isAdmin(session: any): boolean {  //eslint-disable-line
//   return session?.user?.user_metadata?.role === 'ADMIN';
// }

// function hasRole(session: any, role: string): boolean {  //eslint-disable-line
//   return session?.user?.user_metadata?.role === role;
// }

//
// // Utility function for token extraction
// export function extractTokenFromHeader(req: NextRequest): string | null {
//   const authHeader = req.headers.get('authorization');
//   return authHeader ? authHeader.split(' ')[1] : null;
// }
