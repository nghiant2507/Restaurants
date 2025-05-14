import { IconName } from 'lucide-react/dynamic';
import React from 'react';
import { ZodTypeAny } from 'zod';

import { Checkbox } from '~/core/components/ui/checkbox';
import { FormControl } from '~/core/components/ui/form';
import { Input } from '~/core/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/core/components/ui/select';
import { Textarea } from '~/core/components/ui/textarea';

export interface InputPropsType {
  name: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'custom';
  placeholder?: string;
  rules: ZodTypeAny;
  options?: {
    label: string;
    value: string;
  }[];
  component?: React.ComponentType<{
    value: string | undefined;
    onChange: (value: string) => void;
  }>;
}

export interface FieldType {
  label: string;
  required?: boolean;
  inputProps: InputPropsType;
  icon?: {
    name: IconName;
    size: number;
  };
  visible?: boolean;
}

export const ItemField = ({
  item,
  field,
}: {
  item: InputPropsType;
  field: any;//eslint-disable-line
}) => {
  switch (item.type) {
    case 'textarea':
      return <Textarea placeholder={item.placeholder} {...field} />;
    case 'select':
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={item.placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {item.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'checkbox':
      return (
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      );
    case 'custom':
      if (!item.component) return null;
      const CustomComponent = item.component;
      return <CustomComponent value={field.value} onChange={field.onChange} />;
    default:
      return (
        <Input
          className={
            'w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          }
          type={item?.type ?? 'text'}
          placeholder={item.placeholder}
          {...field}
        />
      );
  }
};
