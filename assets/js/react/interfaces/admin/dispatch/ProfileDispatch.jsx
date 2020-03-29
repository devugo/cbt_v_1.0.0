import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import Profile from '../pages/Profile';

const ProfileDispatch = () => {
    return (
        <Provider store={store}>
            <Profile />
        </Provider>
    );
}

let admin_profile = document.getElementById('admin-profile');

admin_profile && ReactDOM.render(<ProfileDispatch />, admin_profile);

export default ProfileDispatch;