import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import Questions from '../pages/Questions';

const QuestionsDispatch = () => {
    return (
        <Provider store={store}>
          <Questions />
        </Provider>
    );
}

let admin_questions = document.getElementById('admin-questions');

admin_questions && ReactDOM.render(<QuestionsDispatch />, admin_questions);

export default QuestionsDispatch;