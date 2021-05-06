import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FileSet from './FileSet';
import ProgressBar from './ProgressBar';
import { ContextMenuForwardRef } from './ContextMenu';

import FileUploader from 'utils/FileUploader';
import { getFilesState } from 'contexts/FilesContext';
import { executeShowFiles } from 'utils/ApiClient';
import { sortCreatedAtDesc } from 'utils/FileSorter';

import { UploadedFile } from 'types/UploadedFile';

const FilesAreaStyled = styled.div`
  margin-top: 30px;
  min-height: 80px;
  padding: 1rem;
  border: dashed 3px #ccc;
`;

type SelectedList = {
  [key: string]: boolean;
}

export default function FilesArea (): React.ReactElement {
  const { files, setFiles } = getFilesState();
  const [progress, setProgress] = useState(-1);
  const [pressing, setPressing] = useState(false);
  const [selectedList, setSelectedList] = useState<SelectedList>({});
  const [isDrag, setIsDrag] = useState(false);
  const [fileKeyList, setFileKeyList] = useState<string[]>([]);

  const ref = React.useRef<HTMLDivElement>(null);

  const isClick = () => !isDrag;

  const initSelectedList = () => {
    if (!isClick()) return;

    const list: SelectedList = {};
    files.forEach((file: UploadedFile) => (list[file.FileKey] = false));
    setSelectedList(list);
    setFileKeyList([]);
  };

  const pushFileKey = (fileKey: string) => {
    if (fileKeyList.findIndex((item) => item === fileKey) > -1) return;

    setFileKeyList([fileKey].concat(fileKeyList));
  };

  useEffect(() => {
    executeShowFiles(setFiles);
    if (ref.current == null) {
      return;
    }

    ref.current.addEventListener('selectstart', (e: any) => e.preventDefault());
  }, []);

  useEffect(() => {
    initSelectedList();
  }, [files]);

  const dropItem = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const droppedFiles = e.dataTransfer.files;
    // FilesAreaからのdropをキャンセル
    if (droppedFiles.length < 1) {
      return;
    }

    setProgress(0);

    const fileUploader = new FileUploader(droppedFiles);
    fileUploader.analyze().then((response) => {
      const timer = setInterval(() => {
        if (fileUploader.running()) {
          setProgress(fileUploader.progress());
        }

        const uploadedFile: UploadedFile | null = fileUploader.popUploadedFile();
        if (uploadedFile !== null) {
          files.push(uploadedFile);
          sortCreatedAtDesc(files);
          setFiles(files);
        }

        if (fileUploader.completed()) {
          fileUploader.clear();
          setTimeout(() => {
            setProgress(-1);
            clearInterval(timer);
          }, 500);
        }
      }, 50);

      fileUploader.bulkUpload();
    });
  };

  const setSelected = (selected: boolean, fileKey: string, context: string) => {
    const list: SelectedList = {};

    switch (context) {
      case 'click':
      case 'contextMenuWhenNew':
        for (const [key] of Object.entries(selectedList)) {
          list[key] = fileKey === key ? selected : false;
        }
        setFileKeyList([fileKey]);
        break;
      case 'drag':
      case 'contextMenuWhenSelected':
        if (context === 'drag') {
          pushFileKey(fileKey);
        }
        for (const [key, value] of Object.entries(selectedList)) {
          list[key] = fileKey === key ? selected : value;
        }
        break;
      default:
        throw new Error('Context is not specified.');
    }

    setSelectedList(list);
  };

  const isSelected = (fileKey: string): boolean => selectedList[fileKey];

  const decideClickOrDrag = () => {
    setPressing(true);
    setIsDrag(false);
    setTimeout(() => setIsDrag(true), 300);
  };

  return (
    <>
      <FilesAreaStyled
        ref={ref}
        id="files-area"
        className="uk-flex uk-flex-wrap"
        onClick={() => initSelectedList()}
        onMouseDown={() => decideClickOrDrag()}
        onMouseUp={() => setPressing(false)}
        onMouseLeave={() => setPressing(false)}
        onDragStart={() => setPressing(false)}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => dropItem(e)}
        onDragOver={(e) => e.preventDefault()}
      >
        <ProgressBar progress={progress} />
        {files.map((item: UploadedFile, i: number) => {
          if (item === undefined) return '';

          return (
            <FileSet
              key={item.FileKey}
              file={item}
              pressing={pressing}
              fileKeyList={fileKeyList}
              setSelected={setSelected}
              isSelected={isSelected}
            />
          );
        })}
      </FilesAreaStyled>
      <ContextMenuForwardRef />
    </>
  );
}
