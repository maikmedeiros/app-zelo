'use client';

import { clientApi } from '@/shared/api/client';

export interface UpdatePhotoOutput {
  personId: string;
  key: string;
  sizeBytes: number;
  mimeType: string;
}

export const updatePhoto = (personId: string, file: File) => {
  const body = new FormData();
  body.append('file', file);

  return clientApi.put<UpdatePhotoOutput>(`/people/${personId}/photo`, body);
};
