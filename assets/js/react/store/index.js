import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import usersReducer from './reducers/users';
import accountTypesReducer from './reducers/account-types';
import subjectsReducer from './reducers/subjects';
import userGroupsReducer from './reducers/user-groups';
import levelsReducer from './reducers/levels';
import notificationsReducer from './reducers/notifications';

const rootReducer = combineReducers({
    users: usersReducer,
    accountTypes: accountTypesReducer,
    subjects: subjectsReducer,
    userGroups: userGroupsReducer,
    levels: levelsReducer,
    notifications: notificationsReducer
});

export const store = createStore(
    rootReducer,
    applyMiddleware(ReduxThunk)
);

