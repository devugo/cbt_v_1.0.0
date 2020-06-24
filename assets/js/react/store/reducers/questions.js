import { READ_QUESTIONS, CREATE_QUESTION, DELETE_QUESTION, UPDATE_QUESTION, ADD_QUESTIONS_TO_EXAMS, REMOVE_QUESTION_FROM_EXAM } from '../actions/questions';
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
                action.data.updatedAtAgo,
                action.data.exams,
                action.data.image
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
                action.data.updatedAtAgo,
                action.data.exams,
                action.data.image
            );
            const questionIndex = questions.findIndex(question => question.id === updatedQuestion.id);

            questions[questionIndex] = updatedQuestion;

            return {
                ...state,
                data: questions
            }
        case ADD_QUESTIONS_TO_EXAMS:
            const oldQuestions = state.data;
            const questionsToAdd = action.data.questions;
            const examsToAdd = action.data.exams;

            let newQ = [];

            questionsToAdd.map(q => {
                oldQuestions.map(oQ => {
                    if(oQ.iri === q){
                        newQ.push(oQ);
                    }
                });
            });

            const newQuestions = newQ.map(q => {
                let newArr = [...q.exams, ...examsToAdd]; // concat added exams
                let newObj = {...q, exams: [...new Set(newArr)]}; // not to have duplicate

                return newObj;
            });

            newQuestions.map(q => {
                let qIndex = oldQuestions.findIndex(oq => oq.iri === q.iri);
                oldQuestions[qIndex] = q;
            });

            return {
                ...state,
                data: oldQuestions
            }
        case REMOVE_QUESTION_FROM_EXAM:
            const oldQ = state.data;
            const updatedQ = new Question(
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
                action.data.updatedAtAgo,
                action.data.exams,
                action.data.image
            );
            const questionIn = oldQ.findIndex(question => question.id === updatedQ.id);

            oldQ[questionIn] = updatedQ;

            return {
                ...state,
                data: oldQ
            }
    }
    return state;
}