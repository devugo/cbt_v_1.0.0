import axios from 'axios';

import * as ENV from '../../ENV';
import UserGroup from '../../models/UserGroup';

export const READ_USER_GROUPS = 'READ_USER_GROUPS';
export const CREATE_USER_GROUP = 'CREATE_USER_GROUP';
export const DELETE_USER_GROUP = 'DELETE_USER_GROUP';
export const UPDATE_USER_GROUP = 'UPDATE_USER_GROUP';
export const ACTIVATE_USER_GROUP = 'ACTIVATE_USER_GROUP';

export const create = (formData) => {
    return async (dispatch, getState) => {
        // any async code you want
        try{
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/user_group-api/create`,
                headers: ENV.HEADERS,
                data: formData
            });
            const resData = await response.data;
            
            const userGroupData = JSON.parse(resData.userGroup);
            dispatch({
                type: CREATE_USER_GROUP,
                data: userGroupData
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
                url: `${ENV.HOST}/api/user_groups?page=${page}&pagination=${pagination}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            const totalData = await response.data['hydra:totalItems'];

            let userGroupsData = resData.map(userGrp => new UserGroup(userGrp.id, userGrp['@id'], userGrp.title, userGrp.description, userGrp.cost, userGrp.daysValidity, userGrp.isActive, userGrp.createdBy, userGrp.createdAtAgo, userGrp.updatedAtAgo, userGrp.noOfExams));

            dispatch({
                type: READ_USER_GROUPS,
                data: userGroupsData,
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
                url: `${ENV.HOST}/user_group-api/update/${id}`,
                headers: ENV.HEADERS,
                data: formData
            });

            const resData = await response.data;
            
            const userGroupData = JSON.parse(resData.userGroup);
            dispatch({
                type: UPDATE_USER_GROUP,
                data: userGroupData
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
                url: `${ENV.HOST}/user_group-api/delete`,
                headers: ENV.HEADERS,
                data: iris
            });
            const resData = await response.data;

            dispatch({
                type: DELETE_USER_GROUP,
                data: iris
            });
        }catch (err){
            throw err;
        }
    }
}

export const activate = (id, type) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'PUT',
                url: `${ENV.HOST}/user_group-api/activate/${id}`,
                headers: ENV.HEADERS,
                data: {
                    type: type
                }
            });

            const resData = await response.data;
            
            const userGroupData = JSON.parse(resData.userGroup);
            dispatch({
                type: ACTIVATE_USER_GROUP,
                data: userGroupData
            });
        }catch(err){
            throw err;
        }
    }
}