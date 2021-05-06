import React from 'react';
import { executeDownloadFile } from 'utils/ApiClient';

export async function getBase64Data (fileKey: string) {
  return await executeDownloadFile(fileKey);
}

export function dropOnDesktop (e: React.DragEvent<HTMLElement>, fileName: string, base64Data: string) {
  e.dataTransfer.setData(
    'DownloadUrl',
    'applicatin/octet-stream:%s:data:image/jpeg;base64,%s'
      .replace('%s', fileName)
      .replace('%s', base64Data),
  );
}
