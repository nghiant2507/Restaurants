'use client';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { LucideStore, Plus } from 'lucide-react';
import React from 'react';

import { DataTable } from '~/components/DataTable';
import { PageContent } from '~/components/PageContent';
import { PageHeader } from '~/components/PageHeader';
import { Button } from '~/core/components/ui/button';
import { UseQueryParams } from '~/core/hooks';
import { useModal } from '~/core/hooks/use-modal';

import { usersService } from './service';
import { UserEntity } from './types';

// import { ListView } from '../restaurants/components/ListView';

const UsersPage = () => {
  const { open } = useModal('user-editor');
  const { queryParams } = UseQueryParams();

  const result = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.find({ ...queryParams }),
  });

  const columns: ColumnDef<UserEntity>[] = [
    {
      accessorKey: 'name',
      header: 'Tên nhà hàng',
      enableSorting: true,
    },
    {
      accessorKey: 'address',
      header: 'Địa chỉ',
      enableSorting: true,
    },
    {
      accessorKey: 'phone',
      header: 'Số điện thoại',
    },
  ];

  return (
    <div>
      <PageHeader
        title={'Nhân Viên'}
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
      <PageContent>
        <DataTable columns={columns} result={result} />
      </PageContent>
    </div>
  );
};

export default UsersPage;
