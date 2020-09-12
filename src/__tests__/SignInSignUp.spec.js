import React from 'react';
import SignIn from '../pages/sign-in/sign-in.component';
import SignUp from '../pages/sign-up/sign-up.component';
import { shallow } from 'enzyme';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

it('should render SignIn page component', () => {
    expect(shallow(<SignIn />)).toMatchSnapshot();
});

it('should render SignUp page component', () => {
    expect(shallow(<SignUp />)).toMatchSnapshot();
});