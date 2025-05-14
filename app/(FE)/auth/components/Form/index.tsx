'use client';

import React, { useCallback, useMemo } from 'react';
import { z } from 'zod';

import { FieldType, FormBuilder } from '~/components/FormBuilder';
import { Button } from '~/core/components/ui/button';
import { useAuth } from '~/core/hooks';

interface UserProps {
  email: string;
  password: string;
}

const FormAuth = () => {
  const { signIn, isSubmit } = useAuth();
  const initialValues = useMemo(() => {
    return {
      email: '',
      password: '',
    } as UserProps;
  }, []);

  const items = useMemo(() => {
    return [
      {
        label: 'Email',
        required: true,
        inputProps: {
          name: 'email',
          type: 'text',
          required: true,
          rules: z.string({ message: 'Không được để trống' }),
        },
        icon: {
          name: 'user',
          size: 20,
        },
      },
      {
        label: 'Mật khẩu',
        required: true,
        inputProps: {
          name: 'password',
          type: 'password',
          rules: z.string().min(6, { message: 'Ít nhất 6 kí tự' }),
        },
        icon: {
          name: 'lock-keyhole',
          size: 18,
        },
      },
    ] as FieldType[];
  }, []);

  const onSubmit = useCallback(async (values: UserProps) => {
    try {
      await signIn(values.email, values.password);
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <FormBuilder
      items={items}
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      <Button
        disabled={isSubmit}
        className={'w-full'}
        size={'lg'}
        type={'submit'}
        children={'Đăng nhập'}
      />
    </FormBuilder>
  );
};

export default FormAuth;
