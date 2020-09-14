import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import IndividualList from '../components/individual-list/individual.list.component';

beforeEach(cleanup);

jest.mock('../contexts/lists/index', () => ({
  useSelectedListValue: jest.fn(() => ({
    setSelectedList: jest.fn(() => ''),
  })),
  useListsValue: jest.fn(() => ({
    setLists: jest.fn(),
    lists: [
      {
        name: 'Book',
        genreName: 'book',
        listId: 'U84wUZZPyTRaTNb3ikIx',
        userId: '5ptktqsmpuONRtc6Q4FKKxnGPXx1',
        docId: 'U84wUZZPyTRaTNb3ikIx',
      },
    ],
  })),
}));

describe('<IndividualList />', () => {
  const list = {
    name: 'Book',
    genreName: 'book',
    listId: 'U84wUZZPyTRaTNb3ikIx',
    userId: '5ptktqsmpuONRtc6Q4FKKxnGPXx1',
    docId: 'U84wUZZPyTRaTNb3ikIx',
  };

  describe('Success', () => {
    it('renders our project', () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={['/']}>
          <IndividualList list={list} />
        </MemoryRouter>
      );
      expect(getByText('Book')).toBeTruthy();
    });

    it('renders the delete overlay and then deletes a list using onClick', () => {
      const { queryByTestId, getByText } = render(
        <MemoryRouter initialEntries={['/']}>
          <IndividualList list={list} />
        </MemoryRouter>
      );

      fireEvent.click(queryByTestId('delete-list'));
      expect(getByText('Are you sure you want delete "Book" ?')).toBeTruthy();
    });

    it('renders the delete overlay and then cancels using onClick', () => {
      const { queryByTestId, getByText } = render(
        <MemoryRouter initialEntries={['/']}>
          <IndividualList list={list} />
        </MemoryRouter>
      );

      fireEvent.click(queryByTestId('delete-list'));
      expect(getByText('Are you sure you want delete "Book" ?')).toBeTruthy();

      fireEvent.click(getByText('Cancel'));
    });
  });
});
