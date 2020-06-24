import axios from 'axios';

import * as ENV from '../../ENV';
import ExamTaken from '../../models/ExamTaken';

export const READ_EXAMS_TAKEN = 'READ_EXAMS_TAKEN';
export const READ_EXAM_TAKEN = 'READ_EXAM_TAKEN';

export const read = (page = 1, pagination = true, exam = null, user = null) => {
    return async (dispatch, getState) => {
        // console.log(getState());
        try {
            const response = await axios({
                method: 'GET',
                url: `${ENV.HOST}/api/exam_takens?exam=${exam}&user=${user}&page=${page}&pagination=${pagination}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            const totalData = await response.data['hydra:totalItems'];

            let examsTakenData = resData.map(examTaken => new ExamTaken(examTaken.id, examTaken['@id'], examTaken.user, examTaken.exam, examTaken.timeSpent, examTaken.timeLeft, examTaken.submittedAtAgo, examTaken.createdAtAgo, examTaken.updatedAtAgo));

            dispatch({
                type: READ_EXAMS_TAKEN,
                data: examsTakenData,
                count: totalData
            });
        } catch (err){
            throw err;
        }
    }
}

export const single = (iri) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${ENV.HOST}${iri}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const examTaken = await response.data;

            let examTakenData = new ExamTaken(examTaken.id, examTaken['@id'], examTaken.user, examTaken.exam, examTaken.timeSpent, examTaken.timeLeft, examTaken.submittedAtAgo, examTaken.createdAtAgo, examTaken.updatedAtAgo);

            dispatch({
                type: READ_EXAM_TAKEN,
                data: examTakenData,
            });
        } catch (err){
            throw err;
        }
    }
}