import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Junta classes condicionais e resolve conflito de utilitário Tailwind (o último vence). */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
