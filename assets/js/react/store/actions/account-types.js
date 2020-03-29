import axios from 'axios';

import * as ENV from '../../ENV';
import AccountType from '../../models/AccountType';

export const READ_ACCOUNT_TYPES = 'READ_ACCOUNT_TYPES';
export const CREATE_ACCOUNT_TYPE = 'CREATE_ACCOUNT_TYPE';
export const DELETE_ACCOUNT_TYPE = 'DELETE_ACCOUNT_TYPE';
export const UPDATE_ACCOUNT_TYPE = 'UPDATE_ACCOUNT_TYPE';

export const create = (formData) => {
    return async (dispatch, getState) => {
        // any async code you want
        try{
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/account_type-api/create`,
                headers: ENV.HEADERS,
                data: formData
            });
            const resData = await response.data;
            
            const accTypeData = JSON.parse(resData.accountType);
            dispatch({
                type: CREATE_ACCOUNT_TYPE,
                data: accTypeData
            });
        }catch(err){
            throw err;
        }
    }
}

export const read = (page = 1, pagination = true) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${ENV.HOST}/api/account_types?page=${page}&pagination=${pagination}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            const totalData = await response.data['hydra:totalItems'];

            let accountTypesData = resData.map(accType => new AccountType(accType.id, accType['@id'], accType.title, accType.description, accType.usersPrivileges, accType.subjectsPrivileges, accType.questionsPrivileges, accType.notificationsPrivileges, accType.levelsPrivileges, accType.accountTypesPrivileges, accType.userGroupsPrivileges, accType.examsPrivileges, accType.createdBy, accType.createdAtAgo, accType.updatedAtAgo));

            dispatch({
                type: READ_ACCOUNT_TYPES,
                data: accountTypesData,
                count: totalData
            });
        } catch (err){
            throw err;
        }
    }
}

export const update = (id, formData) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'PUT',
                url: `${ENV.HOST}/account_type-api/update/${id}`,
                headers: ENV.HEADERS,
                data: formData
            });

            const resData = await response.data;
            
            const accTypeData = JSON.parse(resData.accountType);
            dispatch({
                type: UPDATE_ACCOUNT_TYPE,
                data: accTypeData
            });
        }catch(err){
            throw err;
        }
    }
}

export const destroy = (iris) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'DELETE',
                url: `${ENV.HOST}/account_type-api/delete`,
                headers: ENV.HEADERS,
                data: iris
            });
            const resData = await response.data;

            dispatch({
                type: DELETE_ACCOUNT_TYPE,
                data: iris
            });
        }catch (err){
            throw err;
        }
    }
}