import { UploadedFile } from 'types/UploadedFile';

export function sortCreatedAtDesc (files: UploadedFile[]): UploadedFile[] {
  return files.sort((a, b) => {
    const aa = JSON.parse(a.Attributes);
    const bb = JSON.parse(b.Attributes);

    return Date.parse(aa.CreatedAt) > Date.parse(bb.CreatedAt) ? -1 : 1;
  });
}

export function sortCreatedAtAsc (files: UploadedFile[]): UploadedFile[] {
  return files.sort((a, b) => {
    const aa = JSON.parse(a.Attributes);
    const bb = JSON.parse(b.Attributes);

    return Date.parse(aa.CreatedAt) < Date.parse(bb.CreatedAt) ? -1 : 1;
  });
}
