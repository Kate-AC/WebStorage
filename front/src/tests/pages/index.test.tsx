import React from 'react';
import Index from 'pages/index';
import renderer from 'react-test-renderer';

test('basic', () => {
  const index = renderer.create(<Index />);

  expect(index).toMatchSnapshot();
});

