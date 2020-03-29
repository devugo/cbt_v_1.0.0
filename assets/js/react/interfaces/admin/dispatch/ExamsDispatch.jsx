import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import Exams from '../pages/Exams';

const ExamsDispatch = () => {
    return (
        <Provider store={store}>
          <Exams />
        </Provider>
    );
}

let admin_exams = document.getElementById('admin-exams');

admin_exams && ReactDOM.render(<ExamsDispatch />, admin_exams);

export default ExamsDispatch;