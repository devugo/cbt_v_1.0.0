import axios from 'axios';

import * as ENV from '../../ENV';
import Subject from '../../models/Subject';

export const READ_SUBJECTS = 'READ_SUBJECTS';
export const CREATE_SUBJECT = 'CREATE_SUBJECT';
export const DELETE_SUBJECT = 'DELETE_SUBJECT';
export const UPDATE_SUBJECT = 'UPDATE_SUBJECT';
export const ACTIVATE_SUBJECT = 'ACTIVATE_SUBJECT';

export const create = (formData) => {
    return async (dispatch, getState) => {
        // any async code you want
        try{
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/subject-api/create`,
                headers: ENV.HEADERS,
                data: formData
            });
            const resData = await response.data;
            
            const subjectData = JSON.parse(resData.subject);
            dispatch({
                type: CREATE_SUBJECT,
                data: subjectData
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
                url: `${ENV.HOST}/api/subjects?page=${page}&pagination=${pagination}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            const totalData = await response.data['hydra:totalItems'];

            let subjectsData = resData.map(subject => new Subject(subject.id, subject['@id'], subject.title, subject.description, subject.isActive, subject.createdBy, subject.createdAtAgo, subject.updatedAtAgo));

            dispatch({
                type: READ_SUBJECTS,
                data: subjectsData,
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
                url: `${ENV.HOST}/subject-api/update/${id}`,
                headers: ENV.HEADERS,
                data: formData
            });

            const resData = await response.data;
            
            const subjectData = JSON.parse(resData.subject);
            dispatch({
                type: UPDATE_SUBJECT,
                data: subjectData
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
                url: `${ENV.HOST}/subject-api/delete`,
                headers: ENV.HEADERS,
                data: iris
            });
            const resData = await response.data;

            dispatch({
                type: DELETE_SUBJECT,
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
                url: `${ENV.HOST}/subject-api/activate/${id}`,
                headers: ENV.HEADERS,
                data: {
                    type: type
                }
            });

            const resData = await response.data;
            
            const subjectData = JSON.parse(resData.subject);
            dispatch({
                type: ACTIVATE_SUBJECT,
                data: subjectData
            });
        }catch(err){
            throw err;
        }
    }
}