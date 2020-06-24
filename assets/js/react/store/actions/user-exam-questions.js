import axios from 'axios';

import * as ENV from '../../ENV';
import UserExamQuestion from '../../models/UserExamQuestion';

export const READ_USER_EXAM_QUESTIONS = 'READ_USER_EXAM_QUESTIONS';
export const SUBMIT_ANSWER = 'SUBMIT_ANSWER';
export const SUBMIT_EXAM = 'SUBMIT_EXAM';

export const read = (page = 1, pagination = true, examTaken = null) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${ENV.HOST}/api/user_exam_questions?page=${page}&pagination=${pagination}&examTaken=${examTaken}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            const totalData = await response.data['hydra:totalItems'];

            let questionsData = resData.map(question => new UserExamQuestion(question.id, question['@id'], question.QuestionType, question.exam, question.content, question.options, question.noOfOptions, question.chosenAnswers, question.correctAnswers, question.createdAtAgo, question.updatedAtAgo, question.image, question.explanationResource, question.explanationText));

            dispatch({
                type: READ_USER_EXAM_QUESTIONS,
                data: questionsData,
                count: totalData
            });
        } catch (err){
            throw err;
        }
    }
}

export const submitAnswer = (id, answer) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'PUT',
                url: `${ENV.HOST}/exam-api/submit_answer/${id}`,
                headers: ENV.HEADERS,
                data: {
                    answer: answer
                }
            });
            const resData = await response.data;
            
            const userQuestionData = JSON.parse(resData.userQuestion);
            dispatch({
                type: SUBMIT_ANSWER,
                data: userQuestionData
            });
        } catch (err){
            throw err;
        }
    }
}

export const submitExam = (examTakenIRI, timeSpent, timeLeft) => {
    const matches = (examTakenIRI).match(/(\d+)/);
    const idToEdit = matches[0];

    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'PUT',
                url: `${ENV.HOST}/exam-api/submit_exam/${idToEdit}`,
                headers: ENV.HEADERS,
                data: {
                    timeLeft: timeLeft,
                    timeSpent: timeSpent
                }
            });
            const resData = await response.data;
            
            const examTakenData = JSON.parse(resData.examTaken);
            dispatch({
                type: SUBMIT_EXAM,
                data: examTakenData
            });
        } catch (err){
            throw err;
        }
    }
}