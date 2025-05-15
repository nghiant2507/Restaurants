import { useQuery } from '@tanstack/react-query';
import { LucideStore } from 'lucide-react';
import React from 'react';

import { ModalComponent } from '~/components/Modal';
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

  return (
    <ModalComponent
      modalKey={'restaurant-info'}
      title={result?.data?.name ?? ''}
      icon={LucideStore}
    >
      <Widget />
    </ModalComponent>
  );
};
