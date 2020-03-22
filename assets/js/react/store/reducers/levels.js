import { READ_LEVELS, CREATE_LEVEL, DELETE_LEVEL, UPDATE_LEVEL } from '../actions/levels';
import Level from '../../models/Level';

const initialState = {
    data: [],
    count: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_LEVELS:
            return {
                data: action.data,
                count: action.count
            };
        case CREATE_LEVEL:
            const newLevel = new Level(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description, 
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            return {
                ...state,
                data: state.data.concat(newLevel),
                count: state.count++
            }
        case DELETE_LEVEL:
            let newData = state.data.filter(level => action.data.indexOf(level.iri) === -1);
            return {
                ...state,
                data: newData,
                count: state.count--
            }
        case UPDATE_LEVEL:
            const levels = state.data;
            const updatedLevel = new Level(
                action.data.id, 
                action.data['@id'], 
                action.data.title, 
                action.data.description, 
                action.data.createdBy,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            const levelIndex = levels.findIndex(level => level.id === updatedLevel.id);

            levels[levelIndex] = updatedLevel;

            return {
                ...state,
                data: levels
            }
    }
    return state;
}