import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { AccessLevel, withApiAuth } from '@/be/lib/AuthMiddleware';
import { prisma } from '@/be/lib/prisma';

import { CreateRestaurantSchema, ListUserSchema } from './schema';

const listRestaurants = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  try {
    const params = ListUserSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
    });
    const restaurants = await prisma.restaurant.findMany({
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { createdAt: 'desc' },
    });
    const totalData = await prisma.restaurant.count();

    return NextResponse.json({
      data: restaurants,
      meta: {
        page: params.page,
        limit: params.limit,
        totalData,
        totalPages: Math.ceil(totalData / params.limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'lỗi lấy danh sách nhà hàng ',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
};

const createRestaurant = async (
  req: NextRequest,
  context: { session: any }, //eslint-disable-line
) => {
  try {
    const body = await req.json();

    const validatedData = CreateRestaurantSchema.parse(body);

    const ownerId = context.session.user.id;

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        address: validatedData.address,
        phone: validatedData.phone,
        email: validatedData.email,
        ownerId: ownerId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Tạo nhà hàng thành công',
        data: newRestaurant,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Create restaurant error:', error);

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
      {
        error: 'Lỗi tạo nhà hàng',
        details: error instanceof Error ? error.message : 'Lỗi không xác định',
      },
      { status: 500 },
    );
  }
};
export const POST = withApiAuth(createRestaurant, {
  accessLevel: AccessLevel.ADMIN,
  requireRole: ['ADMIN', 'manager'],
});

export const GET = withApiAuth(listRestaurants, {
  accessLevel: AccessLevel.ADMIN,
  requireRole: ['ADMIN', 'manager'],
});
