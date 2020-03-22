import React from 'react';

const Backdrop = props => {
    return <div className="backdrop" onClick={props.closeSideDrawer}></div>
}

export default Backdrop;