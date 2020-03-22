import React from 'react';
import { Popconfirm, Tag } from 'antd';

const QuickConfirm = props => {

    return (
        <Popconfirm 
            placement="top" 
            title={props.title} 
            onConfirm={props.ok} 
            okText="Ok" 
            cancelText="No" 
            trigger="hover"
            icon={props.icon}
        >
            <Tag color={props.color}>{props.tagName}</Tag>
        </Popconfirm>
    );
}

export default  QuickConfirm;
