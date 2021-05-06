import React from 'react';
import styled from 'styled-components';
import Item from './parts/Item';
import Link from 'next/link';
// import SearchForm from './parts/SearchForm';

const HeaderStyled = styled.div`
  .uk-navbar-container {
    background: #00303f;
  }

  .uk-logo {
    color: #fff;
  }
`;

export default function Header (): React.ReactElement {
  return (
    <HeaderStyled>
      <nav className="uk-navbar-container uk-navbar" uk-navbar="true">
        <div className="uk-navbar-left">
          <Link href="/">
            <a className="uk-navbar-item uk-logo">WebStorage</a>
          </Link>
        </div>
        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav">
            <Item name="Login" path="/login" />
          </ul>
          <div className="uk-navbar-item">{/*
            <SearchForm />
*/}</div>
        </div>
      </nav>
    </HeaderStyled>
  );
}
