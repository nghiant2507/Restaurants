import { LucideStore } from 'lucide-react';
import React from 'react';

import { ModalComponent } from '~/components/Modal';
import { useModal } from '~/core/hooks/use-modal';

import { Widget } from './Widget';

export const RestaurantEditor = () => {
  const { payload: restaurantId = 0 } = useModal<number>('restaurant-editor');
  console.log(restaurantId);
  return (
    <ModalComponent
      modalKey={'restaurant-editor'}
      title={restaurantId ? 'Cập nhập nhà hàng' : 'Tạo nhà hàng'}
      icon={LucideStore}
    >
      <Widget />
    </ModalComponent>
  );
};
