import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import UserGroups from '../pages/UserGroups';

const UserGroupsDispatch = () => {
    return (
        <Provider store={store}>
          <UserGroups />
        </Provider>
    );
}

let admin_user_groups = document.getElementById('admin-user_groups');

admin_user_groups && ReactDOM.render(<UserGroupsDispatch />, admin_user_groups);

export default UserGroupsDispatch;