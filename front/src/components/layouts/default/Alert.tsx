import React, { useState } from 'react';
import { alertStore } from 'store/index';
import styled from 'styled-components';

const AlertStyled = styled.div`
  position: relative;
  margin: 0;
`;

type Props = {
}

export default function Alert (props: Props): React.ReactElement {
  const [alert, setAlert] = useState({ type: '', message: '' });

  alertStore.subscribe(() => {
    const state = alertStore.getState();
    setAlert({
      type: state.type,
      message: state.message,
    });
  });

  if (alert.message.length < 1) {
    return <></>;
  }

  return (
    <AlertStyled className={'uk-alert uk-alert-' + alert.type}>
      <a className="uk-alert-close" uk-close="true" onClick={ () => setAlert({ type: '', message: '' }) }></a>
      <p>{alert.message}</p>
    </AlertStyled>
  );
}
