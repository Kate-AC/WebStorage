import React from 'react';
import styled from 'styled-components';

const ProgressBarStyled = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;

  #progressbar {
    width: 80%;
  }
`;

type Props = {
  progress: number;
};

export default function ProgressBar (props: Props): React.ReactElement {
  if (props.progress < 0) {
    return <></>;
  }

  return (
    <ProgressBarStyled>
      <progress
        id="progressbar"
        className="uk-progress"
        value={props.progress}
        max="100"
      ></progress>
    </ProgressBarStyled>
  );
}
