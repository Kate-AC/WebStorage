import React, { useState, useContext, createContext } from 'react';
import { UploadedFile } from 'types/UploadedFile';

export type FilesContextType = {
  files: UploadedFile[];
  setFiles: (arg1: UploadedFile[]) => void
}

export const FilesContext = createContext({
  files: [] as UploadedFile[],
  setFiles: (arg1: UploadedFile[]) => {},
});

type Props = {
  children?: React.ReactNode;
};

export function FilesContextProvider (props: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const filesState: FilesContextType = {
    files: files,
    setFiles: setFiles,
  };

  return (
    <FilesContext.Provider value={filesState}>
      {props.children}
    </FilesContext.Provider>
  );
}

export function getFilesState (): FilesContextType {
  return useContext(FilesContext);
}
