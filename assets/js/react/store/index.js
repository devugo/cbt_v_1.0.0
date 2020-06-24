import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import authReducer from './reducers/auth';
import usersReducer from './reducers/users';
import accountTypesReducer from './reducers/account-types';
import subjectsReducer from './reducers/subjects';
import userGroupsReducer from './reducers/user-groups';
import levelsReducer from './reducers/levels';
import notificationsReducer from './reducers/notifications';
import examTypesReducer from './reducers/exam-types';
import examsReducer from './reducers/exams';
import questionTypesReducer from './reducers/question-types';
import questionsReducer from './reducers/questions';
import userQuestionsReducer from './reducers/user-exam-questions';
import examsTakenReducer from './reducers/exams-taken';

const rootReducer = combineReducers({
    auth: authReducer,
    users: usersReducer,
    accountTypes: accountTypesReducer,
    subjects: subjectsReducer,
    userGroups: userGroupsReducer,
    levels: levelsReducer,
    notifications: notificationsReducer,
    examTypes: examTypesReducer,
    exams: examsReducer,
    questionTypes: questionTypesReducer,
    questions: questionsReducer,
    userQuestions: userQuestionsReducer,
    examsTaken: examsTakenReducer
});

export const store = createStore(
    rootReducer,
    applyMiddleware(ReduxThunk)
);

