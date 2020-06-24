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

let user_profile = document.getElementById('user-profile');

user_profile && ReactDOM.render(<ProfileDispatch />, user_profile);

export default ProfileDispatch;