'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { DynamicIcon } from 'lucide-react/dynamic';
import { DefaultValues, useForm } from 'react-hook-form';
import { z, ZodTypeAny } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/core/components/ui/form';
import { cn } from '~/lib/utils';

import { FieldType, ItemField } from './ItemField';

type FormBuilderProps<T extends Record<string, any>> = {  //eslint-disable-line
  items: FieldType[];
  initialValues: DefaultValues<T>;
  onSubmit: any; //eslint-disable-line
  children: React.ReactNode;
};

export const FormBuilder = <T extends Record<string, any>>({  //eslint-disable-line
  items,
  initialValues,
  onSubmit,
  children,
}: FormBuilderProps<T>) => {
  const schema = items.reduce(
    (acc, item) => {
      if (item.inputProps.rules) {
        acc[item.inputProps.name] = item.inputProps.rules;
      }
      return acc;
    },
    {} as Record<string, ZodTypeAny>,
  );

  const formSchema = z.object(schema);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: { ...initialValues },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        autoComplete="off"
      >
        {items.map((item: FieldType) => {
          const { visible = false, required = false } = item;

          if (visible) return null;

          return (
            <FormField
              key={item.inputProps.name}
              control={form.control}
              defaultValue={''}
              name={item.inputProps.name as any} //eslint-disable-line
              render={({ field }) => (
                <FormItem
                  className={cn('flex gap-3', {
                    'flex-col': item.inputProps.type !== 'checkbox',
                    'flex-row items-start': item.inputProps.type === 'checkbox',
                  })}
                >
                  {item.inputProps.type !== 'checkbox' && (
                    <FormLabel>
                      {item.label}
                      {required && (
                        <span className={'text-red-700 -ml-1'}>*</span>
                      )}
                    </FormLabel>
                  )}
                  <FormControl>
                    <div
                      className={
                        item?.inputProps?.type !== 'textarea' &&
                        item?.inputProps?.type !== 'select' &&
                        item?.inputProps?.type !== 'checkbox'
                          ? 'flex h-10 items-center rounded-md border border-input bg-white text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 focus-within:shadow-md'
                          : ''
                      }
                    >
                      {item?.icon && (
                        <DynamicIcon
                          className={'ml-3'}
                          name={item.icon.name}
                          color={'black'}
                          size={item.icon.size}
                        />
                      )}
                      <ItemField item={item.inputProps} field={field} />
                    </div>
                  </FormControl>
                  {item.inputProps.type === 'checkbox' && (
                    <FormLabel>{item.label}</FormLabel>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        {children}
      </form>
    </Form>
  );
};
