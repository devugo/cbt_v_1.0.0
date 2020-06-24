import axios from 'axios';

import * as ENV from '../../ENV';
import Exam from '../../models/Exam';

export const READ_EXAMS = 'READ_EXAMS';
export const CREATE_EXAM = 'CREATE_EXAM';
export const DELETE_EXAM = 'DELETE_EXAM';
export const UPDATE_EXAM = 'UPDATE_EXAM';
export const ACTIVATE_EXAM = 'ACTIVATE_EXAM';
export const GENERATE_QUESTIONS_TO_EXAM = 'GENERATE_QUESTIONS_TO_EXAM';

export const create = (formData) => {
    return async (dispatch, getState) => {
        // any async code you want
        try{
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/exam-api/create`,
                headers: ENV.HEADERS,
                data: formData
            });
            const resData = await response.data;
            
            const examData = JSON.parse(resData.exam);
            dispatch({
                type: CREATE_EXAM,
                data: examData
            });
        }catch(err){
            throw err;
        }
    }
}

export const read = (page = 1, pagination = true, userGroup = null, addQuestions = null) => {
    return async (dispatch, getState) => {
        // console.log(getState());
        try {
            const response = await axios({
                method: 'GET',
                url: `${ENV.HOST}/api/exams?groups=${userGroup}&addQuestions=${addQuestions}&page=${page}&pagination=${pagination}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            const totalData = await response.data['hydra:totalItems'];

            let examsData = resData.map(exam => new Exam(exam.id, exam['@id'], exam.title, exam.description, exam.startFrom, exam.endAfter, exam.duration, exam.maximumAttempts, exam.percentagePassMark, exam.correctAnswerScore, exam.wrongAnswerScore, exam.allowedIpAddresses, exam.viewAnswersAfterSubmitting, exam.openQuiz, exam.showResultPosition, exam.addQuestions, exam.price, exam.generateCertificate, exam.certificateText, exam.createdAtAgo, exam.updatedAtAgo, exam.isActive, exam.groups[0], exam.examType, exam.startTime, exam.endTime, exam.questions.length, exam.shuffleQuestions, exam.shuffleOptions));

            dispatch({
                type: READ_EXAMS,
                data: examsData,
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
                url: `${ENV.HOST}/exam-api/update/${id}`,
                headers: ENV.HEADERS,
                data: formData
            });

            const resData = await response.data;
            
            const examData = JSON.parse(resData.exam);
            dispatch({
                type: UPDATE_EXAM,
                data: examData
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
                url: `${ENV.HOST}/exam-api/delete`,
                headers: ENV.HEADERS,
                data: iris
            });
            const resData = await response.data;

            dispatch({
                type: DELETE_EXAM,
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
                url: `${ENV.HOST}/exam-api/activate/${id}`,
                headers: ENV.HEADERS,
                data: {
                    type: type
                }
            });

            const resData = await response.data;
            
            const examData = JSON.parse(resData.exam);

            // return console.log(examData);
            dispatch({
                type: ACTIVATE_EXAM,
                data: examData
            });
        }catch(err){
            throw err;
        }
    }
}

export const generateQuestions = (formData, id) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/exam-api/generate_questions/${id}`,
                headers: ENV.HEADERS,
                data: formData
            });

            const resData = await response.data;
            
            const examData = JSON.parse(resData.exam);

            // return console.log(examData);
            dispatch({
                type: GENERATE_QUESTIONS_TO_EXAM,
                data: examData
            });
        }catch(err){
            throw err;
        }
    }
}