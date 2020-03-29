import { READ_EXAMS, CREATE_EXAM, DELETE_EXAM, ACTIVATE_EXAM, UPDATE_EXAM } from '../actions/exams';
import Exam from '../../models/Exam';
import { ITEMSPERPAGE } from '../../ENV';

const initialState = {
    data: [],
    count: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_EXAMS:
            return {
                data: action.data,
                count: action.count
            };
        case CREATE_EXAM:
            const newExam = new Exam(
                action.data.id, 
                action.data['@id'],
                action.data.title, 
                action.data.description, 
                action.data.startFrom,
                action.data.endAfter,
                action.data.duration,
                action.data.maximumAttempts,
                action.data.percentagePassMark,
                action.data.correctAnswerScore,
                action.data.wrongAnswerScore,
                action.data.allowedIpAddresses,
                action.data.viewAnswersAfterSubmitting,
                action.data.openQuiz,
                action.data.showResultPosition,
                action.data.addQuestions,
                action.data.price,
                action.data.generateCertificate,
                action.data.certificateText,
                action.data.createdAtAgo,
                action.data.updatedAtAgo,
                action.data.isActive,
                action.data.groups[0],
                action.data.examType,
                action.data.startTime,
                action.data.endTime
            );
            return {
                ...state,
                data: ITEMSPERPAGE <= state.data.length ? state.data : state.data.concat(newExam),
                count: state.count++
            }
        case DELETE_EXAM:
            let newData = state.data.filter(acc => action.data.indexOf(acc.iri) === -1);
            return {
                ...state,
                data: newData,
                count: state.count--
            }
        case UPDATE_EXAM:
            const exams = state.data;
            const updatedExam = new Exam(
                action.data.id, 
                action.data['@id'],
                action.data.title, 
                action.data.description, 
                action.data.startFrom,
                action.data.endAfter,
                action.data.duration,
                action.data.maximumAttempts,
                action.data.percentagePassMark,
                action.data.correctAnswerScore,
                action.data.wrongAnswerScore,
                action.data.allowedIpAddresses,
                action.data.viewAnswersAfterSubmitting,
                action.data.openQuiz,
                action.data.showResultPosition,
                action.data.addQuestions,
                action.data.price,
                action.data.generateCertificate,
                action.data.certificateText,
                action.data.createdAtAgo,
                action.data.updatedAtAgo,
                action.data.isActive,
                action.data.groups[0],
                action.data.examType,
                action.data.startTime,
                action.data.endTime
            );
            const examIndex = exams.findIndex(exam => exam.id === updatedExam.id);

            exams[examIndex] = updatedExam;

            return {
                ...state,
                data: exams
            }
        case ACTIVATE_EXAM:
            const existingExams = state.data;
            const activatedExam = new Exam(
                action.data.id, 
                action.data['@id'],
                action.data.title, 
                action.data.description, 
                action.data.startFrom,
                action.data.endAfter,
                action.data.duration,
                action.data.maximumAttempts,
                action.data.percentagePassMark,
                action.data.correctAnswerScore,
                action.data.wrongAnswerScore,
                action.data.allowedIpAddresses,
                action.data.viewAnswersAfterSubmitting,
                action.data.openQuiz,
                action.data.showResultPosition,
                action.data.addQuestions,
                action.data.price,
                action.data.generateCertificate,
                action.data.certificateText,
                action.data.createdAtAgo,
                action.data.updatedAtAgo,
                action.data.isActive,
                action.data.groups[0],
                action.data.examType,
                action.data.startTime,
                action.data.endTime
            );
            const examActivatedIndex = existingExams.findIndex(exam => exam.id === activatedExam.id);

            existingExams[examActivatedIndex] = activatedExam;

            return {
                ...state,
                data: existingExams
            }
    }
    return state;
}