import React, { useRef, forwardRef } from 'react';
import styled from 'styled-components';
import { getContextMenuState } from 'contexts/ContextMenuContext';
import { getFilesState } from 'contexts/FilesContext';
import { executeOperateFiles, executeGetPresignedUrl } from 'utils/ApiClient';

const ContextMenuStyled = styled.div`
  position: absolute;
  border: solid 1px #ddd;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.9);
  z-index: 100;

  ul {
    font-size: 0.8rem;
    padding: 5px 0;
    margin: 0;
    list-style: none;

    li {
      padding: 2px 20px;
      cursor: pointer;

      &:hover {
        background-color: #0000ff;
        color: #fff;
      }
    }
  }
`;

type Props = {};

export function ContextMenu (props: Props): React.ReactElement {
  const { files, setFiles } = getFilesState();
  const operator = getContextMenuState();
  const aRef: React.RefObject<HTMLAnchorElement> = useRef<HTMLAnchorElement>(null);

  const operateFile = async (order: string) => {
    operator.setVisible(false);
    const deletedFileKeys: string[] = await executeOperateFiles(operator.fileKeys, order);

    if (order === 'delete') {
      setFiles(files.filter((item) => !deletedFileKeys.includes(item.FileKey)));
    }
  };

  const getPresignedUrl = async () => {
    operator.setVisible(false);
    const data = await executeGetPresignedUrl(operator.fileKeys[0]);
    const a = aRef.current;

    if (a === null) return;

    a.href = data;
    a.click();
  };

  const aTag = (
    <a
      ref={aRef}
      onClick={ (e) => e.preventDefault() }
    ></a>
  );

  if (!operator.visible) {
    return <>{ aTag }</>;
  }

  return (
    <ContextMenuStyled
      style={{
        top: operator.top,
        left: operator.left,
      }}
    >
      <ul>
        <li onClick={(e) => operateFile('delete')}>Delete</li>
        <li onClick={(e) => getPresignedUrl()}>Download</li>
      </ul>
      { aTag }
    </ContextMenuStyled>
  );
}

export function ContextMenuForwardRef (): React.ReactElement {
  const contextMenuRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const ForwardRef = forwardRef((props, ref) => {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <ContextMenu />
      </div>
    );
  });

  return <ForwardRef ref={contextMenuRef} />;
}
