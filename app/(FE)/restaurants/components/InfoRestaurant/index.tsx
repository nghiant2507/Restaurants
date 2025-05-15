import { useQuery } from '@tanstack/react-query';
import { LucideStore } from 'lucide-react';
import React from 'react';

import { DrawerComponent } from '~/components/Drawer';
import { useModal } from '~/core/hooks/use-modal';

import { restaurantsService } from '../../service';
import { Widget } from './Widget';

export const InfoRestaurant = () => {
  const { payload: restaurantId = '' } = useModal<string>('restaurant-info');

  const result = useQuery({
    queryKey: ['restaurants', restaurantId],
    queryFn: () => restaurantsService.get(restaurantId),
    enabled: !!restaurantId,
  });
  console.log(result.data);

  return (
    <DrawerComponent
      modalKey={'restaurant-info'}
      title={restaurantId ? 'Tạo nhà hàng' : 'Cập nhập nhà hàng'}
      icon={LucideStore}
    >
      <Widget />
    </DrawerComponent>
  );
};
