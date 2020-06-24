import { READ_EXAMS_TAKEN, READ_EXAM_TAKEN } from "../actions/exams-taken";

const initialState = {
    data: [],
    count: 0,
    single: {}
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_EXAMS_TAKEN:
            return {
                ...state,
                data: action.data,
                count: action.count
            };
        case READ_EXAM_TAKEN:
            return {
                ...state,
                single: action.data
            }
    }
    return state;
}