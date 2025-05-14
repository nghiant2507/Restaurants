import { ReservationEntity, RestaurantEntity } from '~/module/restaurants';

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  OCCUPIED = 'OCCUPIED',
}
export interface TableEntity {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
  reservations?: ReservationEntity[];
  restaurant?: RestaurantEntity;
}
