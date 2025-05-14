'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { DynamicIcon } from 'lucide-react/dynamic';
import { DefaultValues, SubmitHandler, useForm } from 'react-hook-form';
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

// Types
type FormValues = Record<string, any>; //eslint-disable-line

type InputType = 'text' | 'textarea' | 'select' | 'checkbox' | 'custom';

interface FormBuilderProps<T extends FormValues> {
  items: FieldType[];
  initialValues: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
}

const INPUT_TYPES_WITHOUT_WRAPPER: InputType[] = [
  'textarea',
  'select',
  'checkbox',
  'custom',
];

const createFormSchema = (items: FieldType[]): z.ZodObject<any> => {
  return z.object(
    items.reduce(
      (acc, item) => {
        if (item.inputProps.rules) {
          acc[item.inputProps.name] = item.inputProps.rules;
        }
        return acc;
      },
      {} as Record<string, ZodTypeAny>,
    ),
  );
};

const getFormItemClassName = (type: InputType): string => {
  return cn('flex gap-3', {
    'flex-col': type !== 'checkbox',
    'flex-row items-start': type === 'checkbox',
  });
};

const getFormControlClassName = (type: InputType): string => {
  if (INPUT_TYPES_WITHOUT_WRAPPER.includes(type)) {
    return '';
  }
  return 'flex h-10 items-center rounded-md border border-input bg-white text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:shadow-md';
};

// Component
export const FormBuilder = <T extends FormValues>({
  items,
  initialValues,
  onSubmit,
  children,
  className,
}: FormBuilderProps<T>) => {
  const formSchema = createFormSchema(items);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: { ...initialValues },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit as SubmitHandler<z.infer<typeof formSchema>>,
        )}
        className={cn('space-y-6', className)}
        autoComplete="off"
      >
        {items.map((item) => {
          const { visible = false, required = false } = item;
          if (visible) return null;

          const inputType = item.inputProps.type as InputType;

          return (
            <FormField
              key={item.inputProps.name}
              control={form.control}
              name={item.inputProps.name}
              render={({ field }) => (
                <FormItem className={getFormItemClassName(inputType)}>
                  {inputType !== 'checkbox' && (
                    <FormLabel>
                      {item.label}
                      {required && (
                        <span className="text-red-700 -ml-1">*</span>
                      )}
                    </FormLabel>
                  )}
                  <FormControl>
                    <div className={getFormControlClassName(inputType)}>
                      {item?.icon && (
                        <DynamicIcon
                          className="ml-3"
                          name={item.icon.name}
                          color="black"
                          size={item.icon.size}
                        />
                      )}
                      <ItemField item={item.inputProps} field={field} />
                    </div>
                  </FormControl>
                  {inputType === 'checkbox' && (
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
