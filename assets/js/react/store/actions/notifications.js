import axios from 'axios';

import * as ENV from '../../ENV';
import Notification from '../../models/Notification';

export const READ_NOTIFICATIONS = 'READ_NOTIFICATIONS';
export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION';
export const MARK_NOTIFICATION = 'MARK_NOTIFICATION';

export const create = (formData) => {
    return async (dispatch, getState) => {
        // any async code you want
        try{
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/notification-api/create`,
                headers: ENV.HEADERS,
                data: formData
            });
            const resData = await response.data;
            
            const notificationData = JSON.parse(resData.notifications);
            dispatch({
                type: CREATE_NOTIFICATION,
                data: notificationData
            });
        }catch(err){
            throw err;
        }
    }
}

export const read = (page = 1, pagination = true) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${ENV.HOST}/api/notifications?page=${page}&pagination=${pagination}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            const totalData = await response.data['hydra:totalItems'];

            let notificationsData = resData.map(notification => new Notification(notification.id, notification['@id'], notification.sentBy, notification.sentTo, notification.title, notification.message, notification.actionLink, notification.seenAtAgo, notification.createdAtAgo, notification.updatedAtAgo));

            dispatch({
                type: READ_NOTIFICATIONS,
                data: notificationsData,
                count: totalData
            });
        } catch (err){
            throw err;
        }
    }
}

export const update = (id, formData) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'PUT',
                url: `${ENV.HOST}/notification-api/update/${id}`,
                headers: ENV.HEADERS,
                data: formData
            });

            const resData = await response.data;
            
            const notificationData = JSON.parse(resData.notification);
            dispatch({
                type: UPDATE_NOTIFICATION,
                data: notificationData
            });
        }catch(err){
            throw err;
        }
    }
}

export const destroy = (iris) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'DELETE',
                url: `${ENV.HOST}/notification-api/delete`,
                headers: ENV.HEADERS,
                data: iris
            });
            const resData = await response.data;

            dispatch({
                type: DELETE_NOTIFICATION,
                data: iris
            });
        }catch (err){
            throw err;
        }
    }
}

export const mark = (id) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'PUT',
                url: `${ENV.HOST}/notification-api/mark/${id}`,
                headers: ENV.HEADERS
            });

            const resData = await response.data;
            
            const notificationData = JSON.parse(resData.notification);
            dispatch({
                type: MARK_NOTIFICATION,
                data: notificationData
            });
        }catch(err){
            throw err;
        }
    }
}