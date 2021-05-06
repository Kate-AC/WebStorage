import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const ItemStyled = styled.li`
  a {
    color: #ddd !important;
    font-size: 0.75rem !important;
  }
`;

type Props = {
  name: string;
  path: string;
};

export default function Item (props: Props): React.ReactElement {
  return (
    <ItemStyled>
      <Link href={props.path}>
        <a>{props.name}</a>
      </Link>
    </ItemStyled>
  );
}
