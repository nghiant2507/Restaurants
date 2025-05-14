import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { FieldType, FormBuilder } from '~/components/FormBuilder';
import { Button } from '~/core/components/ui/button';
import { useModal } from '~/core/hooks/use-modal';
import UpdateImage from '~/module/upload/UpdateImage';

import { restaurantsService } from '../../service';
import { RestaurantEntity } from '../../types';

export const Widget = () => {
  const { close } = useModal<number>('restaurant-editor');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['restaurants', 'create'],
    mutationFn: async (params: RestaurantEntity) =>
      await restaurantsService.create(params),

    onSuccess: async (data: RestaurantEntity) => {
      close(data);
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });

      toast.success('Tạo nhà hàng thành công', { position: 'top-right' });
    },
    onError: async (error: any) => {//eslint-disable-line
      toast.error('Tạo nhà hàng thất bại', { position: 'top-right' });
    },
  });

  const onSubmit = useCallback(
    (values: RestaurantEntity) => {
      mutate(values);
    },
    [mutate],
  );

  const items = useMemo(() => {
    return [
      {
        label: 'Tên nhà hàng',
        required: true,
        inputProps: {
          name: 'name',
          type: 'text',
          placeholder: 'Nhập tên nhà hàng',
          rules: z.string().min(1, 'Vui lòng nhập tên nhà hàng'),
        },
      },
      {
        label: 'Email',
        required: true,
        inputProps: {
          name: 'email',
          type: 'email',
          placeholder: 'Nhập email',
          rules: z.string().email('Email không hợp lệ').optional(),
        },
      },
      {
        label: 'Địa chỉ',
        required: true,
        inputProps: {
          name: 'address',
          type: 'text',
          placeholder: 'Nhập địa chỉ nhà hàng',
          rules: z.string().min(1, 'Vui lòng nhập địa chỉ'),
        },
      },
      {
        label: 'Số điện thoại',
        required: true,
        inputProps: {
          name: 'phone',
          type: 'text',
          placeholder: 'Nhập số điện thoại',
          rules: z.string().min(1, 'Vui lòng nhập số điện thoại'),
        },
      },
      {
        label: 'Mô tả',
        inputProps: {
          name: 'description',
          type: 'textarea',
          placeholder: 'Nhập mô tả nhà hàng',
          rules: z.string().optional(),
        },
      },
      {
        label: 'Ảnh nhà hàng',
        required: true,
        inputProps: {
          name: 'imageUrl',
          type: 'custom',
          rules: z.string().min(1, 'Vui lòng chọn ảnh'),
          component: ({ value, onChange }) => (
            <UpdateImage value={value} onChange={onChange} />
          ),
        },
      },
    ] as FieldType[];
  }, []);

  const initialValues = useMemo(() => {
    return {
      name: '',
      email: '',
      address: '',
      phone: '',
      description: '',
      imageUrl: '',
    } as RestaurantEntity;
  }, []);
  return (
    <FormBuilder
      items={items}
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      <Button disabled={isPending} className="w-full" size="lg" type="submit">
        {isPending ? 'Đang xử lý...' : 'Tạo nhà hàng'}
      </Button>
    </FormBuilder>
  );
};
