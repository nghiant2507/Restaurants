import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod'; // Validation

import { AccessLevel, withApiAuth } from '@/be/lib/AuthMiddleware';
import { prisma } from '@/be/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  options: z
    .object({
      name: z.string().optional(),
      role: z.enum(['CUSTOMER', 'ADMIN']).default('CUSTOMER'),
    })
    .optional(),
});

async function SignUpUser(request: Request) {
  try {
    const requestBody = await request.json();
    const validatedData = signUpSchema.parse(requestBody);

    const { email, password, options } = validatedData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: options?.name,
          role: options?.role || 'CUSTOMER',
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 400 },
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 400 },
      );
    }

    try {
      const prismaUser = await prisma.user.upsert({
        where: {
          id: data.user.id,
          email: data.user.email || '',
        },
        update: {
          email: data.user.email!,
          name:
            options?.name ||
            data.user.user_metadata?.name ||
            data.user.email?.split('@')[0],
          role: options?.role || 'CUSTOMER',
        },
        create: {
          id: data.user.id,
          email: data.user.email!,
          name:
            options?.name ||
            data.user.user_metadata?.name ||
            data.user.email?.split('@')[0],
          role: options?.role || 'CUSTOMER',
        },
      });

      return NextResponse.json(
        {
          user: prismaUser,
          supabaseUser: data.user,
        },
        { status: 201 },
      );
    } catch (prismaError) {
      console.error('Prisma User Sync Error:', prismaError);

      // Handle specific Prisma errors
      return NextResponse.json(
        {
          error: 'Failed to sync user in database',
          details:
            prismaError instanceof Error
              ? prismaError.message
              : 'Unknown error',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    // Catch-all error handler
    console.error('Signup process error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
export const POST = withApiAuth(SignUpUser, {
  accessLevel: AccessLevel.ADMIN,
  requireRole: ['admin', 'superadmin'],
});
