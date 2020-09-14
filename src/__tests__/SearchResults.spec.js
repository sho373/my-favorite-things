import React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ResultsPage from '../pages/search-results/results.component';

configure({ adapter: new Adapter() });

it('should render SearchResults  page component', () => {
  const mockResults = {
    location: {
      state: {
        genreId: 'book',
        results: [
          {
            Item: {
              author: '吾峠 呼世晴',
              largeImageUrl:
                'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/6265/9784088816265.jpg?_ex=200x200',
              publisherName: '集英社',
              title: '鬼滅の刃 13',
              itemUrl: 'https://books.rakuten.co.jp/rb/15644905/',
            },
          },
        ],
      },
    },
  };

  expect(shallow(<ResultsPage props={mockResults} />)).toMatchSnapshot();
});
