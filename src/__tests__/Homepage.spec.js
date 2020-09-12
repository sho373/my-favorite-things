import React from 'react';
import { shallow } from 'enzyme';
import HomePage from '../pages/homepage/homepage.component';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

it('should render Homepage component', () => {
  expect(shallow(<HomePage />)).toMatchSnapshot();
});