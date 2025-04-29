import { z } from 'zod';

export const CreateRestaurantSchema = z.object({
  name: z.string().min(2, 'Tên nhà hàng phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional(),
});

export const ListUserSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional().or(z.literal('')),
});
