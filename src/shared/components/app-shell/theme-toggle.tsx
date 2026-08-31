'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { ptBR } from '@/shared/i18n/pt-BR';
import { cn } from '@/shared/utils/cn';

const THEME_COOKIE = 'zelo-theme';
const ONE_YEAR = 60 * 60 * 24 * 365;

export type ThemeChoice = 'system' | 'light' | 'dark';

const OPTIONS: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: 'system', label: ptBR.common.themeSystem, icon: Monitor },
  { value: 'light', label: ptBR.common.themeLight, icon: Sun },
  { value: 'dark', label: ptBR.common.themeDark, icon: Moon },
];

const apply = (choice: ThemeChoice): void => {
  const root = document.documentElement;

  if (choice === 'system') {
    delete root.dataset.theme;
    document.cookie = `${THEME_COOKIE}=; path=/; max-age=0; samesite=lax`;
    return;
  }

  root.dataset.theme = choice;
  document.cookie = `${THEME_COOKIE}=${choice}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
};

export function ThemeToggle({ current }: { current: ThemeChoice }) {
  const [choice, setChoice] = useState<ThemeChoice>(current);

  return (
    <fieldset className="flex flex-col gap-1.5 px-3 py-2">
      <legend className="text-xs font-medium text-text-muted">{ptBR.common.theme}</legend>

      <div className="flex gap-1">
        {OPTIONS.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={choice === option.value}
              onClick={() => {
                apply(option.value);
                setChoice(option.value);
              }}
              className={cn(
                'flex flex-1 items-center justify-center gap-1 rounded-control border px-2 text-xs',
                choice === option.value
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-border text-text-muted',
              )}
            >
              <Icon aria-hidden className="size-4" />
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
