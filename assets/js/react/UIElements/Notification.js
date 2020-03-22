import React from 'react';
import { notification } from 'antd';

export const Notification = (type, message, description, duration) => {
    notification[type]({
        message: message,
        description: description,
        duration: duration
    })
}