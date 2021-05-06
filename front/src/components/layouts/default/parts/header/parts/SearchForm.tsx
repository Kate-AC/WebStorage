import React from 'react';
import styled from 'styled-components';

const SearchFormStyled = styled.form`
  .uk-button-default {
    color: #fff !important;
    border-color: #fff !important;
  }
`;

export default function SearchForm (): React.ReactElement {
  return (
    <SearchFormStyled action="javascript:void(0)">
      <input className="uk-input uk-form-width-medium" type="text" placeholder="Any file name..." />
      <button className="uk-button uk-button-default">Search</button>
    </SearchFormStyled>
  );
}
