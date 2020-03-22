import React from 'react';
import logo from '../../../images/logo_without_bg.png';

const Logo = props => {
    return <img src={logo} className={props.className} />
}

export default Logo;