import { READ_ACCOUNT_TYPES, CREATE_ACCOUNT_TYPE, DELETE_ACCOUNT_TYPE, UPDATE_ACCOUNT_TYPE } from '../actions/account-types';
import AccountType from '../../models/AccountType';
import { ITEMSPERPAGE } from '../../ENV';

const initialState = {
    data: [],
    count: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_ACCOUNT_TYPES:
            return {
                data: action.data,
                count: action.count
            };
        case CREATE_ACCOUNT_TYPE:
            const newAccountType = new AccountType(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description, 
                action.data.usersPrivileges, 
                action.data.subjectsPrivileges,
                action.data.questionsPrivileges,
                action.data.notificationsPrivileges,
                action.data.levelsPrivileges,
                action.data.accountTypesPrivileges,
                action.data.userGroupsPrivileges,
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            return {
                ...state,
                data: ITEMSPERPAGE <= state.data.length ? stet.data : state.data.concat(newAccountType),
                count: state.count++
            }
        case DELETE_ACCOUNT_TYPE:
            let newData = state.data.filter(acc => action.data.indexOf(acc.iri) === -1);
            return {
                ...state,
                data: newData,
                count: state.count--
            }
        case UPDATE_ACCOUNT_TYPE:
            const accTypes = state.data;
            const updatedAccType = new AccountType(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description, 
                action.data.usersPrivileges, 
                action.data.subjectsPrivileges,
                action.data.questionsPrivileges,
                action.data.notificationsPrivileges,
                action.data.levelsPrivileges,
                action.data.accountTypesPrivileges,
                action.data.userGroupsPrivileges,
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            const accTypeIndex = accTypes.findIndex(acc => acc.id === updatedAccType.id);

            accTypes[accTypeIndex] = updatedAccType;

            return {
                ...state,
                data: accTypes
            }
    }
    return state;
}