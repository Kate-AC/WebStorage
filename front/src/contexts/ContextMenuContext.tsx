import React, { useState, useContext, createContext } from 'react';

type Props = {
  children?: React.ReactNode;
};

type ContextMenuContextType = {
  visible: boolean;
  top: number;
  left: number;
  fileKeys: string[];
  setVisible: (arg1: boolean) => void;
  setTop: (arg1: number) => void;
  setLeft: (arg1: number) => void;
  setFileKeys: (arg1: string[]) => void;
}

export const ContextMenuContext = createContext({
  visible: false,
  top: 0,
  left: 0,
  fileKeys: [] as string[],
  setVisible: (arg1: boolean) => {},
  setTop: (arg1: number) => {},
  setLeft: (arg1: number) => {},
  setFileKeys: (arg1: string[]) => {},
});

export function ContextMenuContextProvider (props: Props) {
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [fileKeys, setFileKeys] = useState<string[]>([]);

  const operator: ContextMenuContextType = {
    visible: visible,
    top: top,
    left: left,
    fileKeys: fileKeys,
    setVisible: setVisible,
    setTop: setTop,
    setLeft: setLeft,
    setFileKeys: setFileKeys,
  };

  return (
    <ContextMenuContext.Provider value={operator}>
      {props.children}
    </ContextMenuContext.Provider>
  );
}

export function getContextMenuState (): ContextMenuContextType {
  return useContext(ContextMenuContext);
}
