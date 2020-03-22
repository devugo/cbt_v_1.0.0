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

let admin_notifications = document.getElementById('admin-notifications');

admin_notifications && ReactDOM.render(<NotificationsDispatch />, admin_notifications);

export default NotificationsDispatch;