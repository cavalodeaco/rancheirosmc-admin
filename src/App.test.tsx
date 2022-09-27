import React from 'react';
import { render } from '@testing-library/react';
import App from './App';


test('set document title', () => {
  render(<App />);
  const title = document.title;
  expect(title).toBe('PPV Admin');
});