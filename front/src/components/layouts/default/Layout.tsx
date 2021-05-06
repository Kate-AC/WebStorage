import React from 'react';
import Head from 'next/head';
// import SideMenu from './parts/side_menu/SideMenu';
import Header from './parts/header/Header';
import Alert from './Alert';
import { getContextMenuState } from 'contexts/ContextMenuContext';
import styled from 'styled-components';

const LayoutStyled = styled.div`
  html,
  body,
  body > div:first-child,
  div#__next,
  main {
    height: 100%;
  }
`;

type Props = {
  children: any;
};

export function Layout (props: Props): React.ReactElement {
  const operator = getContextMenuState();

  const mouseDownEvent = (e: React.MouseEvent<HTMLElement>) => {
    operator.setVisible(false);
  };

  return (
    <LayoutStyled>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <Header />
      <Alert />
      <main
        className="uk-grid-collapse uk-child-width-expand@s"
        uk-grid="true"
        onClick={mouseDownEvent}
      >
        <div className="uk-width-auto uk-padding-remove">{/*  <SideMenu /> */}</div>

        <div className="uk-width-expand">
          {/*
          <div className="uk-padding">
            <ul className="uk-breadcrumb">
              <li><a href="">hoge</a></li>
              <li><a href="">fuga</a></li>
              <li><span>nanana</span></li>
            </ul>
          </div>
*/}
          <div className="uk-padding uk-padding-remove-vertical">{props.children}</div>
        </div>
      </main>
    </LayoutStyled>
  );
}
