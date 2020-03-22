import { READ_USER_GROUPS, CREATE_USER_GROUP, DELETE_USER_GROUP, UPDATE_USER_GROUP, ACTIVATE_USER_GROUP } from '../actions/user-groups';
import UserGroup from '../../models/UserGroup';

const initialState = {
    data: [],
    count: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_USER_GROUPS:
            return {
                data: action.data,
                count: action.count
            };
        case CREATE_USER_GROUP:
            const newUserGroup = new UserGroup(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description, 
                action.data.cost, 
                action.data.daysValidity, 
                action.data.isActive, 
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            return {
                ...state,
                data: state.data.concat(newUserGroup),
                count: state.count++
            }
        case DELETE_USER_GROUP:
            let newData = state.data.filter(userGrp => action.data.indexOf(userGrp.iri) === -1);
            return {
                ...state,
                data: newData,
                count: state.count--
            }
        case UPDATE_USER_GROUP:
            const userGroups = state.data;
            const updatedUserGroup = new UserGroup(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description, 
                action.data.cost, 
                action.data.daysValidity, 
                action.data.isActive, 
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            const userGroupIndex = userGroups.findIndex(userGrp => userGrp.id === updatedUserGroup.id);

            userGroups[userGroupIndex] = updatedUserGroup;

            return {
                ...state,
                data: userGroups
            }
        case ACTIVATE_USER_GROUP:
            const existingUserGroups = state.data;
            const activatedUserGroup = new UserGroup(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description, 
                action.data.cost, 
                action.data.daysValidity, 
                action.data.isActive, 
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            const userGroupActivatedIndex = existingUserGroups.findIndex(user => user.id === activatedUserGroup.id);

            existingUserGroups[userGroupActivatedIndex] = activatedUserGroup;

            return {
                ...state,
                data: existingUserGroups
            }
    }
    return state;
}