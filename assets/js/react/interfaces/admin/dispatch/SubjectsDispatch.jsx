import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import Subjects from '../pages/Subjects';

const SubjectsDispatch = () => {
    return (
        <Provider store={store}>
          <Subjects />
        </Provider>
    );
}

let admin_subjects = document.getElementById('admin-subjects');

admin_subjects && ReactDOM.render(<SubjectsDispatch />, admin_subjects);

export default SubjectsDispatch;