import React from 'react';
import { Layout as DefaultLayout } from 'components/layouts/default/Layout';
import styled from 'styled-components';
import FilesArea from 'components/folder/FilesArea';

const IndexStyled = styled.div``;

export default function Index (): React.ReactElement {
  return (
    <DefaultLayout>
      <IndexStyled>
        <FilesArea />
      </IndexStyled>
    </DefaultLayout>
  );
}
