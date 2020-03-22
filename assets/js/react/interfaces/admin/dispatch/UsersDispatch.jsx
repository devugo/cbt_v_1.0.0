import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import Users from '../pages/Users';

const UsersDispatch = () => {
    return (
        <Provider store={store}>
          <Users />
        </Provider>
    );
}

let admin_users = document.getElementById('admin-users');

admin_users && ReactDOM.render(<UsersDispatch />, admin_users);

export default UsersDispatch;