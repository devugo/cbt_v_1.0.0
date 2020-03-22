import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { ValidationForm, TextInput, Checkbox } from 'react-bootstrap4-form-validation';
import { Spin, Alert } from 'antd';
import 'antd/dist/antd.min.css';

import { encrypt } from '../../../helpers/functions/encrypt';
import * as ENV from '../../../ENV';
import { Message } from '../../../UIElements/Message';

const emptyFormData = {
    username: '',
    password: '',
    remember_me: false
}

const Login = () => {

    const [formData, setFormData] = useState(emptyFormData);
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState();

    const onClose = useCallback(() => {
        setErrors();
    }, []);

    const changeFormData = useCallback((e, value) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }, [formData]);

    const loginUser = useCallback((e) => {
        e.preventDefault();
        setLoader(true);
        setErrors('');

        axios({
            method: 'POST',
            url: ENV.HOST + '/user-login',
            data: {
                email: formData.username,
                password: formData.password,
                remember_me: formData.remember_me
            },
            headers: {
                'content-type': 'application/json',
            },
        })
        .then(response => {
            
            let userData = response.data;
            encrypt('IRI', userData.iri);
            Message('success', `Welcome ${userData.username}`, 10);

            if(userData.roles.indexOf('ROLE_ADMIN') != -1){
                window.location.href = `${ENV.HOST}/admin`;
            }else if(userData.roles.indexOf('ROLE_SCHOOL') != -1){
                window.location.href = `${ENV.HOST}/school`;
            }else{
                window.location.href = `${ENV.HOST}/teacher`;
            }
        })
        .catch(error => {
            setErrors(error.response.data.error);
            
        })
        .finally(() => {
            setLoader(false);
            // setLoader(false);
        })
    }, [ENV, formData]);

    return (
        <div className="login-content">
            <div className="login-logo">
                <a href="/">
                    <img src={`${ENV.HOST}images/icon/logo.png`} alt="CoolAdmin" />
                </a>
            </div>
            {
                errors &&
                <Alert 
                    className="text-center"
                    message='Error'
                    description={errors}
                    type="error"
                    closable
                    onClose={onClose}
                />
            }
            <div className="login-form">
                <ValidationForm onSubmit={loginUser}>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label htmlFor="username">Username / Email</label>
                                <TextInput name="username" id="username" required
                                    value={formData.username}
                                    onChange={changeFormData}
                                    errorMessage={{required:"Please enter your username/email"}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <TextInput name="password" id="password" required
                                    type="password"
                                    value={formData.password}
                                    onChange={changeFormData}
                                    errorMessage={{required:"Please enter your password"}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="form-group">
                                <Checkbox name="remember_me" id="remember_me"
                                    label="Remember me"
                                    value={formData.remember_me}
                                    onChange={changeFormData}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <button disabled={loader} className="btn btn-login">{loader ? <span><Spin /></span> : "Login"}</button>
                    </div>
                </ValidationForm>
                {/* <form action="" method="post">
                    <div class="form-group">
                        <label>Email Address</label>
                        <input class="au-input au-input--full" type="email" name="email" placeholder="Email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input class="au-input au-input--full" type="password" name="password" placeholder="Password">
                    </div>
                    <div class="login-checkbox">
                        <label>
                            <input type="checkbox" name="remember">Remember Me
                        </label>
                        <label>
                            <a href="#">Forgotten Password?</a>
                        </label>
                    </div>
                    <button class="au-btn au-btn--block au-btn--green m-b-20" type="submit">sign in</button>
                    <div class="social-login-content">
                        <div class="social-button">
                            <button class="au-btn au-btn--block au-btn--blue m-b-20">sign in with facebook</button>
                            <button class="au-btn au-btn--block au-btn--blue2">sign in with twitter</button>
                        </div>
                    </div>
                </form> */}
                <div className="register-link">
                    <p>
                        Don't you have account?
                        <a href="#">Sign Up Here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;