import React from 'react';
import { render, cleanup } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router';

beforeEach(cleanup);

describe('<App />', () => {
  it('renders the application', () => {
    const { queryByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(queryByTestId('application')).toBeTruthy();
    expect(queryByTestId('page-not-found')).toBeFalsy();
  });

  it('invalid path should redirect to 404', () => {
    const { queryByTestId } = render(
      <MemoryRouter initialEntries={['/random']}>
        <App />
      </MemoryRouter>
    );
    expect(queryByTestId('page-not-found')).toBeTruthy();
  });
});
