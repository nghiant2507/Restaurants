import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { AccessLevel, withApiAuth } from '@/be/lib/AuthMiddleware';
import { prisma } from '@/be/lib/prisma';

import { CreateRestaurantSchema, paramSearch } from './schema';

const listRestaurants = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  try {
    const params = paramSearch.parse({
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
        total: totalData,
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

    const newRestaurant = await prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          address: validatedData.address,
          phone: validatedData.phone,
          email: validatedData.email,
          imageUrl: validatedData.imageUrl,
          ownerId: ownerId,
          isActive: true,
        },
      });
      await tx.restaurantStaff.create({
        data: {
          userId: ownerId,
          restaurantId: restaurant.id,
          position: 'Owner',
          joinedAt: new Date(),
        },
      });
      return restaurant;
    });

    return NextResponse.json(
      {
        message: 'Tạo nhà hàng thành công',
        data: newRestaurant,
      },
      { status: 201 },
    );
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
