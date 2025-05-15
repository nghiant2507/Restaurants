import { UseQueryResult } from '@tanstack/react-query';
import clsx from 'clsx';
import { isArray } from 'lodash-es';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

import { PageContent } from '~/components/PageContent';
import { Button } from '~/core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/core/components/ui/card';
import { useModal } from '~/core/hooks/use-modal';
import {
  getSupabaseImageUrl,
  IResponseError,
  IResponseWithPagination,
} from '~/core/utils';

import { RestaurantEntity } from '../../types';
import { LoadingCard } from './Placeholder';

interface ListViewProps<T> {
  result: UseQueryResult<IResponseWithPagination<T> | T[], IResponseError>;
}

export const ListView = (props: ListViewProps<RestaurantEntity>) => {
  const { open } = useModal('restaurant-info');
  const { result } = props;
  const { data, isLoading } = result;
  const { data: resData } =
    (data as IResponseWithPagination<RestaurantEntity>) || {};

  const calculatedRows = useMemo(() => {
    return isArray(data)
      ? (data as RestaurantEntity[])
      : (resData as RestaurantEntity[]) || [];
  }, [data, resData]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <PageContent>
      <div
        className={
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 '
        }
      >
        {calculatedRows?.map((item: RestaurantEntity) => {
          return (
            <Card
              key={item.id}
              className={'group relative flex flex-col h-full'}
            >
              <CardHeader className={'p-0'}>
                <div className={'relative w-full aspect-[3/2]'}>
                  <Image
                    src={getSupabaseImageUrl(item.imageUrl)}
                    alt={item.name}
                    fill
                    className={'object-cover rounded-t-lg'}
                  />
                </div>
              </CardHeader>
              <CardContent className={'flex-1 grid gap-3'}>
                <CardTitle className={'line-clamp-1'}>{item.name}</CardTitle>
                <CardDescription className={'line-clamp-4'}>
                  {item.description}
                </CardDescription>
              </CardContent>
              <CardFooter className={'p-4 pt-0'}>
                <Button
                  onClick={() => open(item?.id)}
                  className={'flex items-center gap-2 w-full'}
                >
                  <Eye />
                  <p>Chi tiết</p>
                </Button>
              </CardFooter>
              <div
                className={
                  'absolute top-4 left-4 flex justify-center items-center py-px px-1.5 rounded-full bg-black/50'
                }
              >
                <span
                  className={clsx('size-2 rounded-full', {
                    'bg-green-500': item?.isActive,
                    'bg-red-600': !item?.isActive,
                  })}
                ></span>
                <p
                  className={
                    'pl-2 text-xs font-medium text-white transition-all duration-300 w-0 h-4 group-hover:w-30 overflow-hidden'
                  }
                >
                  {item?.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </PageContent>
  );
};
