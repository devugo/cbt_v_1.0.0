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

let user_exams = document.getElementById('user-exams');

user_exams && ReactDOM.render(<ExamsDispatch />, user_exams);

export default ExamsDispatch;