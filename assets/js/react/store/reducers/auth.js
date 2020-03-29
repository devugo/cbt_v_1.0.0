import { LOGIN_USER } from '../actions/auth';

const initialState = {
    data: []
};

export default (state = initialState, action) => {
    switch(action.type){
        case LOGIN_USER:

            return {
                ...state,
                data: action.data
            }
    }
    return state;
}