import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import Levels from '../pages/Levels';

const LevelsDispatch = () => {
    return (
        <Provider store={store}>
          <Levels />
        </Provider>
    );
}

let admin_levels = document.getElementById('admin-levels');

admin_levels && ReactDOM.render(<LevelsDispatch />, admin_levels);

export default LevelsDispatch;