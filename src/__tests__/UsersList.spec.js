import React from 'react';
import { shallow } from 'enzyme';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Users from '../pages/users-list/users.component';

configure({adapter: new Adapter()});

it('should render UsersList page component', () => {
    const mockUser = {
        params:{
            displayName:"testUser"
        }
    };
    expect(shallow(<Users match={mockUser}/>)).toMatchSnapshot();
});