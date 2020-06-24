import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import Notifications from '../pages/Notifications';

const NotificationsDispatch = () => {
    return (
        <Provider store={store}>
          <Notifications />
        </Provider>
    );
}

let user_notifications = document.getElementById('user-notifications');

user_notifications && ReactDOM.render(<NotificationsDispatch />, user_notifications);

export default NotificationsDispatch;