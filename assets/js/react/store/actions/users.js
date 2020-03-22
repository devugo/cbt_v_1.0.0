import axios from 'axios';

import * as ENV from '../../ENV';
import User from '../../models/User';

export const READ_USERS = 'READ_USERS';
export const CREATE_USER = 'CREATE_USER';
export const DELETE_USER = 'DELETE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const ACTIVATE_USER = 'ACTIVATE_USER';

export const create = (form) => {
    return async (dispatch, getState) => {
        // any async code you want
        try{
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/user-api/create`,
                headers: ENV.HEADERS,
                data: form
            });
            const resData = await response.data;
            
            const userData = JSON.parse(resData.user);
            dispatch({
                type: CREATE_USER,
                data: userData
            });
        }catch(err){
            throw err;
        }
    }
}

export const read = (page = 1, pagination = true) => {
    return async (dispatch, getState) => {
        // console.log(getState());
        try {
            const response = await axios({
                method: 'GET',
                url: `${ENV.HOST}/api/users?page=${page}&pagination={pagination}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            const totalData = await response.data['hydra:totalItems'];

            let usersData = resData.map(user => new User(user.id, user['@id'], user.photo, `${user.lastname} ${user.firstname} ${user.othernames}`, user.email, user.username, user.dob, user.sex, user.accountType, user.createdAtAgo, user.updatedAtAgo, user.isActive, user.firstname, user.lastname, user.othernames));

            dispatch({
                type: READ_USERS,
                data: usersData,
                count: totalData
            });
        } catch (err){
            throw err;
        }
    }
}

export const update = (id, form) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/user-api/update/${id}`,
                headers: ENV.HEADERS,
                data: form
            });

            const resData = await response.data;
            
            const userData = JSON.parse(resData.user);
            dispatch({
                type: UPDATE_USER,
                data: userData
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
                url: `${ENV.HOST}/user-api/delete`,
                headers: ENV.HEADERS,
                data: iris
            });
            const resData = await response.data;

            dispatch({
                type: DELETE_USER,
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
                url: `${ENV.HOST}/user-api/activate/${id}`,
                headers: ENV.HEADERS,
                data: {
                    type: type
                }
            });

            const resData = await response.data;
            
            const userData = JSON.parse(resData.user);
            dispatch({
                type: ACTIVATE_USER,
                data: userData
            });
        }catch(err){
            throw err;
        }
    }
}