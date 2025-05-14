import { OrderItemEntity } from '../../orders';
import { RestaurantEntity } from '../../restaurants';
import { UserEntity } from '../../user';

export interface MenuCategoryEntity {
  id: string;
  name: string;
  description?: string;
  restaurantId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  restaurant: RestaurantEntity;
  menuItems: MenuItemEntity[];
}
export interface MenuItemEntity {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  restaurantId: string;
  categoryId: string;
  creatorId: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: MenuCategoryEntity;
  creator: UserEntity;
  restaurant: RestaurantEntity;
  orderItems: OrderItemEntity[];
}
