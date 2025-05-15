import { MenuItemEntity } from '~/module/menus';
import { RestaurantEntity } from '~/module/restaurants';
import { UserEntity } from '~/module/users';

export enum OrderStatus {
  PENDING = 'PENDING',
}

export interface OrderEntity {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  restaurantId: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
  customer: UserEntity;
  restaurant: RestaurantEntity;
  orderItems: OrderItemEntity[];
}

export interface OrderItemEntity {
  id: string;
  quantity: number;
  orderId: string;
  menuItemId: string;
  createdAt: Date;
  updatedAt: Date;
  menuItem: MenuItemEntity;
  order: OrderEntity;
}
