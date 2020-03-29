import { READ_QUESTION_TYPES, CREATE_QUESTION_TYPE, DELETE_QUESTION_TYPE, UPDATE_QUESTION_TYPE } from '../actions/question-types';
import QuestionType from '../../models/QuestionType';
import { ITEMSPERPAGE } from '../../ENV';

const initialState = {
    data: [],
    count: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_QUESTION_TYPES:
            return {
                data: action.data,
                count: action.count
            };
        case CREATE_QUESTION_TYPE:
            const newQuestionType = new QuestionType(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            return {
                ...state,
                data: ITEMSPERPAGE <= state.data.length ? stet.data : state.data.concat(newQuestionType),
                count: state.count++
            }
        case DELETE_QUESTION_TYPE:
            let newData = state.data.filter(question => action.data.indexOf(question.iri) === -1);
            return {
                ...state,
                data: newData,
                count: state.count--
            }
        case UPDATE_QUESTION_TYPE:
            const questionTypes = state.data;
            const updatedQuestionType = new QuestionType(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            const questionTypeIndex = questionTypes.findIndex(question => question.id === updatedQuestionType.id);

            questionTypes[questionTypeIndex] = updateduestionType;

            return {
                ...state,
                data: questionTypes
            }
    }
    return state;
}