import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import Login from '../pages/Login';

const LoginDispatch = () => {
    return (
        <Provider store={store}>
          <Login />
        </Provider>
    );
}

let login_page = document.getElementById('login-page');

login_page && ReactDOM.render(<LoginDispatch />, login_page);

export default LoginDispatch;