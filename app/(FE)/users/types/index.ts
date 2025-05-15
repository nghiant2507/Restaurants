import { MenuItemEntity } from '~/module/menus';
import { OrderEntity } from '~/module/orders';
import { ReservationEntity, RestaurantEntity } from '~/module/restaurants';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

export interface UserEntity {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  menuItems?: MenuItemEntity[];
  orders?: OrderEntity[];
  reservations?: ReservationEntity[];
  restaurants?: RestaurantEntity[];
}
