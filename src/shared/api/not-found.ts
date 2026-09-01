import 'server-only';
import { notFound } from 'next/navigation';
import { isApiError } from './errors';

export const orNotFound = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    return await promise;
  } catch (error) {
    if (isApiError(error) && error.statusCode === 404) notFound();
    throw error;
  }
};
