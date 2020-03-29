import { READ_USERS, CREATE_USER, DELETE_USER, ACTIVATE_USER, UPDATE_USER, GET_AUTH_USER } from '../actions/users';
import User from '../../models/User';
import { ITEMSPERPAGE } from '../../ENV';

const initialState = {
    data: [],
    auth: {},
    count: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_USERS:
            return {
                data: action.data,
                count: action.count
            };
        case GET_AUTH_USER:
            console.log(state);
            return {
                ...state,
                auth: action.data
            };
        case CREATE_USER:
            const newUser = new User(
                action.data.id, 
                action.data['@id'], 
                action.data.photo, 
                `${action.data.lastname} ${action.data.firstname} ${action.data.othernames}`,
                action.data.email, 
                action.data.username, 
                action.data.dob,
                action.data.sex,
                action.data.accountType,
                action.data.createdAtAgo,
                action.data.updatedAtAgo,
                action.data.isActive,
                action.data.firstname,
                action.data.lastname,
                action.data.othernames,
                action.data.mobile,
                action.data.userGroup
            );
            return {
                ...state,
                data: ITEMSPERPAGE <= state.data.length ? state.data : state.data.concat(newUser),
                count: state.count++
            }
        case DELETE_USER:
            let newData = state.data.filter(acc => action.data.indexOf(acc.iri) === -1);
            return {
                ...state,
                data: newData,
                count: state.count--
            }
        case UPDATE_USER:
            const users = state.data;
            const updatedUser = new User(
                action.data.id, 
                action.data['@id'], 
                action.data.photo, 
                `${action.data.lastname} ${action.data.firstname} ${action.data.othernames}`,
                action.data.email, 
                action.data.username, 
                action.data.dob,
                action.data.sex,
                action.data.accountType,
                action.data.createdAtAgo,
                action.data.updatedAtAgo,
                action.data.isActive,
                action.data.firstname,
                action.data.lastname,
                action.data.othernames,
                action.data.mobile,
                action.data.userGroup
            );
            const userIndex = users.findIndex(user => user.id === updatedUser.id);

            users[userIndex] = updatedUser;

            return {
                ...state,
                data: users
            }
        case ACTIVATE_USER:
            const existingUsers = state.data;
            const activatedUser = new User(
                action.data.id, 
                action.data['@id'], 
                action.data.photo, 
                `${action.data.lastname} ${action.data.firstname} ${action.data.othernames}`,
                action.data.email, 
                action.data.username, 
                action.data.dob,
                action.data.sex,
                action.data.accountType,
                action.data.createdAtAgo,
                action.data.updatedAtAgo,
                action.data.isActive,
                action.data.firstname,
                action.data.lastname,
                action.data.othernames,
                action.data.mobile,
                action.data.userGroup
            );
            const userActivatedIndex = existingUsers.findIndex(user => user.id === activatedUser.id);

            existingUsers[userActivatedIndex] = activatedUser;

            return {
                ...state,
                data: existingUsers
            }
    }
    return state;
}