'use client';

import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { ptBR } from '@/shared/i18n/pt-BR';
import { cn } from '@/shared/utils/cn';

export type ReportLevel = keyof typeof ptBR.enums.reportLevel;

const LEVELS = Object.keys(ptBR.enums.reportLevel) as ReportLevel[];

export interface LevelPickerProps {
  name: string;
  legend: string;
  value?: ReportLevel;
  onValueChange?: (value: ReportLevel) => void;
  disabled?: boolean;
}

export function LevelPicker({
  name,
  legend,
  value,
  onValueChange,
  disabled = false,
}: LevelPickerProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium">{legend}</legend>

      <RadioGroupPrimitive.Root
        name={name}
        value={value}
        onValueChange={(next) => onValueChange?.(next as ReportLevel)}
        disabled={disabled}
        className="flex flex-wrap gap-2"
      >
        {LEVELS.map((level) => (
          <RadioGroupPrimitive.Item
            key={level}
            value={level}
            id={`${name}-${level}`}
            className={cn(
              'min-h-11 rounded-control border border-border-strong px-3 text-sm',
              'data-[state=checked]:border-brand data-[state=checked]:bg-brand-soft data-[state=checked]:text-brand',
              'disabled:pointer-events-none disabled:opacity-60',
            )}
          >
            {ptBR.enums.reportLevel[level]}
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
    </fieldset>
  );
}
