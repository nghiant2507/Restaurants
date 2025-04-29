'use client';

import React, { useCallback, useMemo } from 'react';
import { z } from 'zod';

import { FieldType, FormBuilder } from '~/components/FormBuilder';
import { Button } from '~/core/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/core/components/ui/card';
import { useAuth } from '~/core/hooks';

interface UserProps {
  email: string;
  password: string;
}

const FormAuth = ({ keyForm }: { keyForm: string }) => {
  const { signIn, signUp, isSubmit } = useAuth();
  const initialValues = useMemo(() => {
    return {
      ...{},
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
  }, [keyForm]);
  const onSubmit = useCallback(
    async (values: UserProps) => {
      try {
        keyForm === 'signin'
          ? await signIn(values.email, values.password)
          : await signUp(values.email, values.password);
      } catch (e) {
        console.log(e);
      }
    },
    [keyForm],
  );

  return (
    <>
      <Card className={'relative z-5 shadow-2xl bg-white'}>
        <CardHeader>
          <CardTitle className={'mx-auto text-2xl font-bold'}>
            {keyForm === 'signin' ? 'Đăng nhập' : 'Đăng ký'}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              children={keyForm === 'signin' ? 'Đăng nhập' : 'Đăng ký'}
            />
          </FormBuilder>
        </CardContent>
      </Card>
    </>
  );
};

export default FormAuth;
