import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store';
import Dashboard from '../pages/Dashboard';

const DashboardDispatch = () => {
    return (
        <Provider store={store}>
          <Dashboard />
        </Provider>
    );
}

let admin_dashboard = document.getElementById('admin-dashboard');

admin_dashboard && ReactDOM.render(<DashboardDispatch />, admin_dashboard);

export default DashboardDispatch;