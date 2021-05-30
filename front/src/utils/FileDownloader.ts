import React from 'react';
import { executeGetPresignedUrl } from 'utils/ApiClient';

export async function getPresignedUrl (fileKey: string) {
  return await executeGetPresignedUrl(fileKey);
}

export function dropOnDesktop (e: React.DragEvent<HTMLElement>, fileName: string, presignedUrl: string) {
  e.dataTransfer.setData(
    'DownloadURL',
    'text/plain:%s:%s'
      .replace('%s', fileName)
      .replace('%s', presignedUrl),
  );
}
