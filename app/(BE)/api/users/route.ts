import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { AccessLevel, withApiAuth } from '@/be/lib/AuthMiddleware';
import { prisma } from '@/be/lib/prisma';

// Validation schema cho query params
const ListUserSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  role: z.string().optional(),
  search: z.string().optional(),
});

async function listUsersHandler(req: NextRequest, context: { session: any }) {
  // Parse query parameters
  const { searchParams } = req.nextUrl;

  try {
    // Validate query params
    const params = ListUserSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      role: searchParams.get('role'),
      search: searchParams.get('search'),
    });

    // Tạo Supabase client service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Truy vấn users từ Prisma với điều kiện linh hoạt
    const whereCondition: any = {};

    if (params.role) {
      whereCondition.role = params.role;
    }

    if (params.search) {
      whereCondition.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    // Lấy tổng số users
    const totalUsers = await prisma.user.count({ where: whereCondition });

    // Lấy danh sách users
    const prismaUsers = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            restaurants: true,
            orders: true,
          },
        },
      },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { createdAt: 'desc' },
    });

    // Chuẩn bị response
    return NextResponse.json({
      users: prismaUsers.map((user) => ({
        ...user,
        restaurantsCount: user._count.restaurants,
        ordersCount: user._count.orders,
      })),
      meta: {
        page: params.page,
        limit: params.limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / params.limit),
      },
    });
  } catch (error) {
    // Xử lý lỗi chi tiết
    console.error('List users error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  } finally {
    // Đóng kết nối Prisma
    await prisma.$disconnect();
  }
}

// Sử dụng middleware với mức truy cập ADMIN
export const GET = withApiAuth(listUsersHandler, {
  accessLevel: AccessLevel.ADMIN,
  requireRole: ['admin', 'superadmin'], // Giới hạn roles cụ thể
});
