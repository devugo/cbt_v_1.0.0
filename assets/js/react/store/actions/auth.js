import axios from 'axios';

import * as ENV from '../../ENV';
import User from '../../models/User';
import { encrypt } from '../../helpers/functions/encrypt';

export const LOGIN_USER = 'LOGIN_USER';

export const login = (formData) => {
    return async (dispatch, getState) => {
        // any async code you want
        try{
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/user-login`,
                headers: {
                    'content-type': 'application/json',
                },
                data: formData
            });
            let resData = await response.data;

            resData = JSON.parse(resData.user);
            encrypt('IRI', resData['@id']);
            
            const userData = new User(resData.id, resData['@id'], resData.photo, `${resData.lastname} ${resData.firstname} ${resData.othernames}`, resData.email, resData.username, resData.dob, resData.sex, resData.accountType, resData.createdAtAgo, resData.updatedAtAgo, resData.isActive, resData.firstname, resData.lastname, resData.othernames);
            dispatch({
                type: LOGIN_USER,
                data: userData
            });
        }catch(err){
            throw err;
        }
    }
}

export const changePassword = (id, formData) => {
    return async (dispatch, getState) => {
        // any async code you want
        try{
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/change-password/${id}`,
                data: formData
            });
            let resData = await response.data;
        }catch(err){
            throw err;
        }
    }
}