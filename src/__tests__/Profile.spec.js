import React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Profile from '../pages/profile/profile.component';

configure({ adapter: new Adapter() });

it('should render Profile page component', () => {
  expect(shallow(<Profile />)).toMatchSnapshot();
});
