import { READ_USER_EXAM_QUESTIONS, SUBMIT_ANSWER } from '../actions/user-exam-questions';
import UserExamQuestion from '../../models/UserExamQuestion';

const initialState = {
    data: [],
    count: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_USER_EXAM_QUESTIONS:
            return {
                data: action.data,
                count: action.count
            };
        case SUBMIT_ANSWER:
            const userQuestions = state.data;
            const updatedUserQuestion = new UserExamQuestion(
                action.data.id, 
                action.data['@id'], 
                action.data.QuestionType, 
                action.data.exam, 
                action.data.content, 
                action.data.options,
                action.data.noOfOptions,
                action.data.chosenAnswers,
                action.data.correctAnswers,
                action.data.createdAtAgo,
                action.data.updatedAtAgo,
                action.data.image,
                action.data.explanationResource,
                action.data.explanationText
            );
            const userQuestionIndex = userQuestions.findIndex(userQ => userQ.id === updatedUserQuestion.id);

            userQuestions[userQuestionIndex] = updatedUserQuestion;

            return {
                ...state,
                data: userQuestions
            }
    }
    return state;
}