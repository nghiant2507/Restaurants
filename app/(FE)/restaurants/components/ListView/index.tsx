import { UseQueryResult } from '@tanstack/react-query';
import { isArray } from 'lodash-es';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

import { Button } from '~/core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/core/components/ui/card';
import { IResponseError, IResponseWithPagination } from '~/core/utils';

import supabaseLoader from '../../../../supabase-loader';
import { RestaurantEntity } from '../../types';

interface ListViewProps<T> {
  result: UseQueryResult<IResponseWithPagination<T> | T[], IResponseError>;
}

export const ListView = (props: ListViewProps<RestaurantEntity>) => {
  const { result } = props;
  const { data } = result;
  const { data: resData } =
    (data as IResponseWithPagination<RestaurantEntity>) || {};

  const calculatedRows = useMemo(() => {
    return isArray(data)
      ? (data as RestaurantEntity[])
      : (resData as RestaurantEntity[]) || [];
  }, [data, resData]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 p-4">
      {calculatedRows?.map((item: RestaurantEntity) => {
        return (
          <Card key={item.id}>
            <CardHeader className={'px-0'}>
              <Image
                loader={supabaseLoader}
                src={item.imageUrl}
                alt={item.name}
                width={100}
                height={100}
                className={'w-full aspect-[3/2] object-cover'}
              />
            </CardHeader>
            <CardContent className="grid gap-3">
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Check /> Mark all as read
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
