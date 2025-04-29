'use client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { UseQueryParams } from '~/core/hooks';

import { restaurantsService } from './service';

const RestaurantPage = () => {
  const { queryParams } = UseQueryParams();
  const result = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantsService.find({ ...queryParams }),
  });
  console.log(result);
  return <div>Restaurants</div>;
};

export default RestaurantPage;
