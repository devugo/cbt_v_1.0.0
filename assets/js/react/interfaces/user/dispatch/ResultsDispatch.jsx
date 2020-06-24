import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import Results from '../pages/Results';

const ResultsDispatch = () => {
    return (
        <Provider store={store}>
          <Results />
        </Provider>
    );
}

let user_results = document.getElementById('user-results');

user_results && ReactDOM.render(<ResultsDispatch />, user_results);

export default ResultsDispatch;