import { MenuCategoryEntity, MenuItemEntity } from '~/module/menus';
import { OrderEntity } from '~/module/orders';
import { TableEntity } from '~/module/tables';
import { UserEntity } from '~/module/users';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
}

export interface RestaurantEntity {
  id: string;
  name: string;
  description?: string | null;
  address: string;
  phone: string;
  email?: string | null;
  ownerId: string;
  isActive: boolean;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  menuCategories?: MenuCategoryEntity[];
  menuItems?: MenuItemEntity[];
  orders?: OrderEntity[];
  reservations?: ReservationEntity[];
  owner?: UserEntity;
  tables?: TableEntity[];
}

export interface ReservationEntity {
  id: string;
  date: Date;
  startTime: Date;
  endTime?: Date | null;
  guestCount: number;
  restaurantId: string;
  tableId: string;
  customerId: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
  customer?: UserEntity;
  restaurant?: RestaurantEntity;
  table?: TableEntity;
}
