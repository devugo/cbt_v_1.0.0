import { READ_SUBJECTS, CREATE_SUBJECT, DELETE_SUBJECT, UPDATE_SUBJECT, ACTIVATE_SUBJECT } from '../actions/subjects';
import Subject from '../../models/Subject';

const initialState = {
    data: [],
    count: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_SUBJECTS:
            return {
                data: action.data,
                count: action.count
            };
        case CREATE_SUBJECT:
            const newSubject = new Subject(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description, 
                action.data.isActive, 
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            return {
                ...state,
                data: state.data.concat(newSubject),
                count: state.count++
            }
        case DELETE_SUBJECT:
            let newData = state.data.filter(subject => action.data.indexOf(subject.iri) === -1);
            return {
                ...state,
                data: newData,
                count: state.count--
            }
        case UPDATE_SUBJECT:
            const subjects = state.data;
            const updatedSubject = new Subject(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description, 
                action.data.isActive, 
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            const subjectIndex = subjects.findIndex(subject => subject.id === updatedSubject.id);

            subjects[subjectIndex] = updatedSubject;

            return {
                ...state,
                data: subjects
            }
        case ACTIVATE_SUBJECT:
            const existingSubjects = state.data;
            const activatedSubject = new Subject(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description, 
                action.data.isActive, 
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            const subjectActivatedIndex = existingSubjects.findIndex(user => user.id === activatedSubject.id);

            existingSubjects[subjectActivatedIndex] = activatedSubject;

            return {
                ...state,
                data: existingSubjects
            }
    }
    return state;
}