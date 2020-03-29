import axios from 'axios';

import * as ENV from '../../ENV';
import ExamType from '../../models/ExamType';

export const READ_EXAM_TYPES = 'READ_EXAM_TYPES';

export const read = (page = 1, pagination = true) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${ENV.HOST}/api/exam_types?page=${page}&pagination=${pagination}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            const totalData = await response.data['hydra:totalItems'];

            let examTypesData = resData.map(examType => new ExamType(examType.id, examType['@id'], examType.title, examType.description, examType.createdAtAgo, examType.updatedAtAgo));

            dispatch({
                type: READ_EXAM_TYPES,
                data: examTypesData,
                count: totalData
            });
        } catch (err){
            throw err;
        }
    }
}