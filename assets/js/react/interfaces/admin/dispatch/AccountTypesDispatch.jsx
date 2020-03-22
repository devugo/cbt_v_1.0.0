import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import AccountTypes from '../pages/AccountTypes';

const AccountTypesDispatch = () => {
    return (
        <Provider store={store}>
          <AccountTypes />
        </Provider>
    );
}

let admin_account_types = document.getElementById('admin-account_types');

admin_account_types && ReactDOM.render(<AccountTypesDispatch />, admin_account_types);

export default AccountTypesDispatch;