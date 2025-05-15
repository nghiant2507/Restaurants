'use client';
import { useQuery } from '@tanstack/react-query';
import { LucideStore, Plus } from 'lucide-react';
import React from 'react';

import { PageHeader } from '~/components/PageHeader';
import { Button } from '~/core/components/ui/button';
import { UseQueryParams } from '~/core/hooks';
import { useModal } from '~/core/hooks/use-modal';

import { InfoRestaurant, ListView, RestaurantEditor } from './components';
import { restaurantsService } from './service';

const RestaurantPage = () => {
  const { open } = useModal('restaurant-editor');
  const { queryParams } = UseQueryParams();

  const result = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantsService.find({ ...queryParams }),
  });

  return (
    <div>
      <PageHeader
        title={'Restaurants'}
        icon={LucideStore}
        extra={
          <Button
            type={'button'}
            onClick={() => open()}
            className={'flex gap-2 items-center'}
          >
            <Plus />
            Tạo
          </Button>
        }
      />
      <ListView result={result} />
      <RestaurantEditor />
      <InfoRestaurant />
    </div>
  );
};

export default RestaurantPage;
