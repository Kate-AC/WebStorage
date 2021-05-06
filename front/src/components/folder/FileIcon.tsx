import React from 'react';
import { FcPicture, FcMusic, FcFilm, FcFile } from 'react-icons/fc';

type Props = {
  fileName: string;
};

export default function FileIcon (props: Props): React.ReactElement {
  const extension = props.fileName.substring(props.fileName.indexOf('.') + 1);

  let icon = <FcFile />;

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      icon = <FcPicture />;
      break;
    case 'mp3':
      icon = <FcMusic />;
      break;
    case 'mp4':
      icon = <FcFilm />;
      break;
    default:
      icon = <FcFile />;
      break;
  }

  return icon;
}
