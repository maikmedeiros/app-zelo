'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { fieldErrorsFrom, isApiError } from '@/shared/api/errors';
import { useToast } from '@/shared/components/toast';

export interface ApiActionOptions {
  success: string;
  failure: string;
  onSuccess?: () => void;
}

export const useApiAction = () => {
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const run = useCallback(
    async (action: () => Promise<unknown>, options: ApiActionOptions): Promise<boolean> => {
      setPending(true);
      setFieldErrors({});

      try {
        await action();
        toast.show({ title: options.success, tone: 'success' });
        options.onSuccess?.();
        router.refresh();
        return true;
      } catch (error) {
        if (isApiError(error) && error.statusCode === 400) {
          setFieldErrors(fieldErrorsFrom(error.cause));
        }

        toast.show({
          title: options.failure,
          description: isApiError(error) ? error.message : undefined,
          tone: 'danger',
        });

        return false;
      } finally {
        setPending(false);
      }
    },
    [router, toast],
  );

  return { run, pending, fieldErrors };
};
