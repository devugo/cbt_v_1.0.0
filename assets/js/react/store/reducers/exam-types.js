import { READ_EXAM_TYPES } from '../actions/exam-types';

const initialState = {
    data: [],
    count: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_EXAM_TYPES:
            return {
                data: action.data,
                count: action.count
            };
    }
    return state;
}