import React from 'react';

export default function QuestionNoTab(props) {

    const divStyle = {
        color: 'white',
        backgroundColor: props.backgroundColor,
        color: props.color,
        fontSize: 12,
        padding: 3,
        width: 40,
        height: 20,
        borderRadius: 5,
        margin: 2,
        whiteSpace: 'nowrap'
    };

    return (
        <span className="qNoTab" style={divStyle} onClick={props.onClick}>
           <strong>{props.no + '. ' + props.option}</strong>
        </span>
    );
}