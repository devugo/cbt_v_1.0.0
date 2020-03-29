import { READ_QUESTIONS, CREATE_QUESTION, DELETE_QUESTION, UPDATE_QUESTION } from '../actions/questions';
import Question from '../../models/Question';

const initialState = {
    data: [],
    count: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_QUESTIONS:
            return {
                data: action.data,
                count: action.count
            };
        case CREATE_QUESTION:
            const newQuestion = new Question(
                action.data.id, 
                action.data['@id'], 
                action.data.content, 
                action.data.explanationText, 
                action.data.explanationResource, 
                action.data.noOfOptions,
                action.data.options,
                action.data.correctAnswers,
                action.data.questionType,
                action.data.subject,
                action.data.level,
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            return {
                ...state,
                data: state.data.concat(newQuestion),
                count: state.count++
            }
        case DELETE_QUESTION:
            let newData = state.data.filter(question => action.data.indexOf(question.iri) === -1);
            return {
                ...state,
                data: newData,
                count: state.count--
            }
        case UPDATE_QUESTION:
            const questions = state.data;
            const updatedQuestion = new Question(
                action.data.id, 
                action.data['@id'], 
                action.data.content, 
                action.data.explanationText, 
                action.data.explanationResource, 
                action.data.noOfOptions,
                action.data.options,
                action.data.correctAnswers,
                action.data.questionType,
                action.data.subject,
                action.data.level,
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            const questionIndex = questions.findIndex(question => question.id === updatedQuestion.id);

            questions[questionIndex] = updatedQuestion;

            return {
                ...state,
                data: questions
            }
    }
    return state;
}