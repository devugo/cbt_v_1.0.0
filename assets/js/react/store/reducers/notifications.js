import { READ_NOTIFICATIONS, CREATE_NOTIFICATION, DELETE_NOTIFICATION, UPDATE_NOTIFICATION, MARK_NOTIFICATION } from '../actions/notifications';
import Notification from '../../models/Notification';

const initialState = {
    data: [],
    count: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case READ_NOTIFICATIONS:
            return {
                data: action.data,
                count: action.count
            };
        case CREATE_NOTIFICATION:
            const newNotifications = action.data.map(noti => {
                return new Notification(
                    noti.id, 
                    noti['@id'], 
                    noti.sentBy, 
                    noti.sentTo, 
                    noti.title, 
                    noti.message, 
                    noti.actionLink, 
                    noti.seenAtAgo,
                    noti.createdAtAgo,
                    noti.updatedAtAgo
                );
            });
            return {
                ...state,
                data: state.data.concat(newNotifications),
                count: state.count++
            }
        case DELETE_NOTIFICATION:
            let newData = state.data.filter(notification => action.data.indexOf(notification.iri) === -1);
            return {
                ...state,
                data: newData,
                count: state.count--
            }
        case UPDATE_NOTIFICATION:
            const notifications = state.data;
            const updatedNotification = new Notification(
                action.data.id, 
                action.data['@id'], 
                action.data.sentBy, 
                action.data.sentTo, 
                action.data.title, 
                action.data.message, 
                action.data.actionLink, 
                action.data.seenAtAgo,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            const notificationIndex = notifications.findIndex(notification => notification.id === updatedNotification.id);

            notifications[notificationIndex] = updatedNotification;

            return {
                ...state,
                data: notifications
            }
        case MARK_NOTIFICATION:
            const existingNotifications = state.data;
            const markedNotification = new Notification(
                action.data.id, 
                action.data['@id'], 
                action.data.sentBy, 
                action.data.sentTo, 
                action.data.title, 
                action.data.message, 
                action.data.actionLink, 
                action.data.seenAtAgo,
                action.data.createdAtAgo,
                action.data.updatedAtAgo
            );
            const markedNotificationIndex = existingNotifications.findIndex(notification => notification.id === markedNotification.id);

            existingNotifications[markedNotificationIndex] = markedNotification;

            return {
                ...state,
                data: existingNotifications
            }
    }
    return state;
}