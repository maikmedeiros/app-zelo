import type { TextareaHTMLAttributes } from 'react';
import { controlClassName } from './input';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={controlClassName(props['aria-invalid'] === true, className)}
      {...props}
    />
  );
}
