import { User } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { withApiAuth } from '@/be/lib/AuthMiddleware';
import { prisma } from '@/be/lib/prisma';

async function getRestaurant(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
    session: {
      user: User;
      access_token?: string;
    };
  },
) {
  try {
    const { id } = await context.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { message: 'Restaurant not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dữ liệu không hợp lệ',
          details: error.errors,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export const GET = withApiAuth(getRestaurant);
