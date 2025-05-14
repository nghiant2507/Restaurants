'use client';
import { useQuery } from '@tanstack/react-query';
import { LucideStore } from 'lucide-react';
import React from 'react';

import { PageHeader } from '~/components/PageHeader';
import { Button } from '~/core/components/ui/button';
import { UseQueryParams } from '~/core/hooks';
import { useModal } from '~/core/hooks/use-modal';

import { ListView, RestaurantEditor } from './components';
import { restaurantsService } from './service';

const RestaurantPage = () => {
  const { queryParams } = UseQueryParams();
  const { open } = useModal('restaurant-editor');

  const result = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantsService.find({ ...queryParams }),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
  return (
    <div>
      <PageHeader
        title={'Restaurants'}
        icon={LucideStore}
        extra={<Button onClick={() => open(3)}>Tạo</Button>}
      />
      <ListView result={result} />
      <RestaurantEditor />
    </div>
  );
};

export default RestaurantPage;
