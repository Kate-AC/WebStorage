import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FileIcon from 'components/folder/FileIcon';
import { getBase64Data, dropOnDesktop } from 'utils/FileDownloader';
import { getContextMenuState } from 'contexts/ContextMenuContext';
import { UploadedFile } from 'types/UploadedFile';

const FileSetStyled = styled.div`
  .file-set {
    cursor: pointer;
    text-align: center;
    margin: 0.5rem;
    height: 85px;
    width: 70px;
    position: relative;

    &.selected {
      background-color: rgba(164, 199, 224, 0.3);
    }
  }

  .event-filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .title {
    font-size: 0.5rem;
    width: 60px;
    height: 30px;
    padding: 0 5px;
    overflow: scroll;
    word-break: break-all;
    /* text-overflow: ellipsis; */
  }

  svg {
    width: 50px;
  }
`;

type Props = {
  file: UploadedFile;
  pressing: boolean;
  setSelected: (arg1: boolean, arg2: string, arg3: string) => void;
  isSelected: (arg1: string) => boolean;
  fileKeyList: string[];
};

export default function FileSet (props: Props): React.ReactElement {
  const [base64Data, setBase64Data] = useState('');
  const operator = getContextMenuState();
  const [randomNumber] = useState(Math.random());
  const { file, pressing, setSelected, isSelected, fileKeyList } = props;

  // state反映の遅延が起こるため、変更を検知してからsetする
  useEffect(() => {
    operator.setFileKeys(fileKeyList);
  }, [operator.visible]);

  const attributes = JSON.parse(file.Attributes);

  const mouseDownEvent = async () => {
    setBase64Data(await getBase64Data(file.FileKey));
  };

  const mouseDragStartEvent = (e: React.DragEvent<HTMLDivElement>) => {
    if (base64Data.length < 1) return;

    dropOnDesktop(e, attributes.FileName, base64Data);
  };

  const contextMenuEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 選択済みのものを右クリックした際は一括選択を解除しない
    if (isSelected(file.FileKey)) {
      setSelected(true, file.FileKey, 'contextMenuWhenSelected');
    } else {
      setSelected(true, file.FileKey, 'contextMenuWhenNew');
    }

    operator.setVisible(true);
    operator.setTop(e.clientY + window.scrollY - 30);
    operator.setLeft(e.clientX + 1);
  };

  const dragFilesEvent = () => {
    if (!pressing) return;

    operator.setVisible(false);
    setSelected(true, file.FileKey, 'drag');
  };

  const clickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    operator.setVisible(false);
    setSelected(true, file.FileKey, 'click');
  };

  return (
    <FileSetStyled>
      <div
        key={randomNumber}
        className={'file-set ' + (isSelected(file.FileKey) ? 'selected' : '')}
      >
        <div
          key={file.FileKey}
          className="event-filter"
          draggable="true"
          onContextMenu={contextMenuEvent}
          onClick={clickEvent}
          onMouseDown={mouseDownEvent}
          onMouseOver={dragFilesEvent}
          onDragStart={mouseDragStartEvent}
        ></div>
        <FileIcon fileName={attributes.FileName} />
        <div className="title">{attributes.FileName}</div>
      </div>
    </FileSetStyled>
  );
}