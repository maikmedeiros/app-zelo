'use client';

import type { InputHTMLAttributes } from 'react';
import { controlClassName } from './input';

export type DatePickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function DatePicker({ className, ...props }: DatePickerProps) {
  return (
    <input
      type="date"
      className={controlClassName(props['aria-invalid'] === true, className)}
      {...props}
    />
  );
}
