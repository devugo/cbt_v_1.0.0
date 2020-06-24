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

let admin_results = document.getElementById('admin-results');

admin_results && ReactDOM.render(<ResultsDispatch />, admin_results);

export default ResultsDispatch;