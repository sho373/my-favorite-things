import React from 'react';
import SignOut from '../pages/sign-out/sign-out.component';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('should render SignOut page component', () => {
  expect(shallow(<SignOut />)).toMatchSnapshot();
});
