import axios from 'axios';

import * as ENV from '../../ENV';
import Question from '../../models/Question';

export const READ_QUESTIONS = 'READ_QUESTIONS';
export const CREATE_QUESTION = 'CREATE_QUESTION';
export const DELETE_QUESTION = 'DELETE_QUESTION';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';

export const create = (form) => {
    return async (dispatch, getState) => {
        // any async code you want
        try{
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/question-api/create`,
                headers: ENV.HEADERS,
                data: form
            });
            const resData = await response.data;
            
            const questionData = JSON.parse(resData.question);
            dispatch({
                type: CREATE_QUESTION,
                data: questionData
            });
        }catch(err){
            throw err;
        }
    }
}                                                                                                                                                                         

export const read = (page = 1, pagination = true) => {
    return async (dispatch, getState) => {
        try {
            console.log('before');
            const response = await axios({
                method: 'GET',
                url: `${ENV.HOST}/api/questions?page=${page}&pagination=${pagination}`,
                headers: ENV.HEADERS
            });
            console.log('after');
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            console.log('middle');
            const totalData = await response.data['hydra:totalItems'];
            console.log('after middle');

            let questionsData = resData.map(question => new Question(question.id, question['@id'], question.content, question.explanationText, question.explanationResource, question.noOfOptions, question.options, question.correctAnswers, question.questionType, question.subject, question.level, question.createdBy, question.createdAtAgo, question.updatedAtAgo));

            dispatch({
                type: READ_QUESTIONS,
                data: questionsData,
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
                url: `${ENV.HOST}/question-api/update/${id}`,
                headers: ENV.HEADERS,
                data: form
            });

            const resData = await response.data;
            
            const questionData = JSON.parse(resData.question);
            dispatch({
                type: UPDATE_QUESTION,
                data: questionData
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
                url: `${ENV.HOST}/question-api/delete`,
                headers: ENV.HEADERS,
                data: iris
            });
            const resData = await response.data;

            dispatch({
                type: DELETE_QUESTION,
                data: iris
            });
        }catch (err){
            throw err;
        }
    }
}