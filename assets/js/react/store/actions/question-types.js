import axios from 'axios';

import * as ENV from '../../ENV';
import QuestionType from '../../models/QuestionType';

export const READ_QUESTION_TYPES = 'READ_QUESTION_TYPES';
export const CREATE_QUESTION_TYPE = 'CREATE_QUESTION_TYPE';
export const DELETE_QUESTION_TYPE = 'DELETE_QUESTION_TYPE';
export const UPDATE_QUESTION_TYPE = 'UPDATE_QUESTION_TYPE';

export const create = (formData) => {
    return async (dispatch, getState) => {
        // any async code you want
        try{
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/question_type-api/create`,
                headers: ENV.HEADERS,
                data: formData
            });
            const resData = await response.data;
            
            const questionTypeData = JSON.parse(resData.questionType);
            dispatch({
                type: CREATE_QUESTION_TYPE,
                data: questionTypeData
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
                url: `${ENV.HOST}/api/question_types?page=${page}&pagination=${pagination}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            const totalData = await response.data['hydra:totalItems'];

            let questionTypesData = resData.map(questionType => new QuestionType(questionType.id, questionType['@id'], questionType.title, questionType.description, questionType.createdAtAgo, questionType.updatedAtAgo));

            dispatch({
                type: READ_QUESTION_TYPES,
                data: questionTypesData,
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
                url: `${ENV.HOST}/question_type-api/update/${id}`,
                headers: ENV.HEADERS,
                data: formData
            });

            const resData = await response.data;
            
            const questionTypeData = JSON.parse(resData.questionType);
            dispatch({
                type: UPDATE_QUESTION_TYPE,
                data: questionTypeData
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
                url: `${ENV.HOST}/question_type-api/delete`,
                headers: ENV.HEADERS,
                data: iris
            });
            const resData = await response.data;

            dispatch({
                type: DELETE_QUESTION_TYPE,
                data: iris
            });
        }catch (err){
            throw err;
        }
    }
}