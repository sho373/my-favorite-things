import React from 'react';
import { render, cleanup} from '@testing-library/react';
import AddList from '../components/individual-list/add.list.component'

jest.mock('../contexts/lists/index', () => ({
    useSelectedListValue: jest.fn(),
    useListsValue: jest.fn(() => ({
      lists: [
        {
            name: 'Book',
            genreName:'book',
            listId: 'U84wUZZPyTRaTNb3ikIx',
            userId: '5ptktqsmpuONRtc6Q4FKKxnGPXx1',
            docId: 'U84wUZZPyTRaTNb3ikIx',
        },
        {
            name: 'Moive',
            genreName:'movie',
            listId: 'rXNocv7vbFSeqebGlLU5',
            userId: '5ptktqsmpuONRtc6Q4FKKxnGPXx1',
            docId: 'rXNocv7vbFSeqebGlLU5',
        },
      ],
      setLists: jest.fn(),
    })),
  }));
  

  beforeEach(cleanup);

  describe('<AddList />', () => {
    describe('Success', () => {

      it('renders <AddList />', () => {
        const { queryByTestId } = render(<AddList />);
        expect(queryByTestId('add-list')).toBeTruthy();
       
      });
    });
  });