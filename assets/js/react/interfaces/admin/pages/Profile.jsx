import React, { useEffect, useCallback, useState, useRef} from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Select, Button, Modal, Alert, Checkbox, Tag, Popconfirm, Popover, Upload, message, Tooltip, Input } from 'antd';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import BluetoothSearchingIcon from '@material-ui/icons/BluetoothSearching';
import Edit from '@material-ui/icons/Edit';
import { LoadingOutlined } from '@ant-design/icons';
import { ValidationForm, TextInput, SelectGroup } from 'react-bootstrap4-form-validation';
import Pagination from '@material-ui/lab/Pagination';

import * as UsersActions from '../../../store/actions/users';
import * as AuthActions from '../../../store/actions/auth';
import * as AccountTypesActions from '../../../store/actions/account-types';
import Breadcrumb from '../components/Breadcrumb';
import useWindowWidth from '../../../helpers/hooks/useWindowWidth';
import UploadButton from '../../../UIElements/UploadButton';
import Card from '../../../UIElements/Card';
import Paginate from '../../../UIElements/Paginate';
import { Notification } from '../../../UIElements/Notification';
import { Message } from '../../../UIElements/Message';
import QuickConfirm from '../../../UIElements/QuickConfirm';


import * as ENV from '../../../ENV';

const itemsPerPage = ENV.ITEMSPERPAGE;
const rangeDisplay = ENV.RANGEDISPLAY;

const emptyFormData = {
    firstname: '',
    lastname: '',
    othernames: '',
    address: '',
    email: '',
    mobile: '',
    username: '',
    image: '',
    accountType: '',
    sex: '',
    dob: '',
    newPassword: '',
    oldPassword: '',
    confirmPassword: ''
};

const clearErrors = {
    title: '',
    description: ''
};

const clearErrorsPassword = {
    title: '',
    description: ''
};

const loaders = {
    content: true,
    action: false,
    upload: false,
    actionChangePassword: false
}

let serverErrorTitle = ENV.ERRORTITLE;
let serverErrorDesc = ENV.ERRORDESC;


const matches = (ENV.IRI).match(/(\d+)/);
const idToEdit = matches[0];

const Profile = () => {

    const width = useWindowWidth();
    const fileInp = useRef(null);

    const user = useSelector(state => state.users.auth);
    const accountTypes = useSelector(state => state.accountTypes.data);
    const dispatch = useDispatch();
    
    // Datatable states
    const [values, setValues] = useState([]);
    const [global, setGlobal] = useState(false);

    const [errors, setErrors] = useState(clearErrors);
    const [errorsPassword, setErrorsPassword] = useState(clearErrorsPassword);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [formData, setFormData] = useState(emptyFormData);
    const [loading, setLoading] = useState(loaders);
    const [imgUrl, setImgUrl] = useState();
    const [filterMe, setFilterMe] = useState("");
    const [activePage, setActivePage] = useState(1);

    const [editMode, setEditMode] = useState(false);

    // Close errors to clear errors
    const onClose = useCallback(() => {
        setErrors(clearErrors);
    }, [setErrors]);

    // Image preview before upload
    const getBase64 = useCallback((file) => {
        let imageSrc;
        setErrors(clearErrors);
        var reader = new FileReader();
        reader.onloadend = function() {
            setImgUrl(reader.result);
            imageSrc = reader.result;
        }
        reader.readAsDataURL(file);
        setLoading({
            ...loading,
            content: false,
            upload: false
        });
        return imageSrc;
    }, [setErrors, setImgUrl, setLoading]);

     // image selector
     const onButtonClick = useCallback(() => {
        // `current` points to the mounted text input element
        fileInp.current.click();
    }, []);

    const changeFormData = useCallback((e) => {
        if(e.target.name == 'image') {

            setErrors(clearErrors); // Newly introduced

            setLoading({
                ...loading,
                content: false,
                upload: true
            });
            let fileContent = e.target.files[0];

            if(fileContent.type !== 'image/jpeg' && fileContent.type !== 'image/jpg' && fileContent.type !== 'image/png'){
                setErrors({
                    ...errors,
                    file: 'Please upload an image in the following formats; jpeg, jpg or png'
                });
                setLoading({
                    ...loading,
                    upload: false
                });
                return;
            }
            if(fileContent.size > 500000){
                setErrors({
                    ...errors,
                    file: 'The maximum image size is 500KB'
                });
                setLoading({
                    ...loading,
                    upload: false
                });
                return;
            }
            setTimeout(() => getBase64(fileContent), 3000);

            setFormData({
                ...formData,
                [e.target.name]: fileContent
            });
        }else{
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
        
    }, [formData, setFormData, getBase64, setLoading, loading, setErrors, errors]);

    const getAccountTypes = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(AccountTypesActions.read(page, pagination));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);

    const matchPassword = useCallback((value) => {
        return value && value === formData.newPassword;   
    }, [formData]);

    const changePassword = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            actionChangePassword: true
        });

        setErrorsPassword(clearErrorsPassword);
        try {
            await dispatch(AuthActions.changePassword(idToEdit, formData));
            Message('success', 'Password was updated successfully', 5);
            setFormData({
                ...formData,
                newPassword: '',
                oldPassword: '',
                confirmPassword: ''
            });
        }catch (error){
            if(error.response.data && error.response.data.message){
                serverErrorDesc = error.response.data.message;
            }
            setErrorsPassword({
                title: serverErrorTitle,
                description: serverErrorDesc
            });
        }
        setLoading({
            ...loading,
            actionChangePassword: false
        });
    }, [setLoading, loading, setErrorsPassword, setFormData, formData, dispatch]);

    const updateUser = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);
        const form = new FormData();
        form.append('firstname', formData.firstname);
        form.append('lastname', formData.lastname);
        form.append('othernames', formData.othernames);
        form.append('username', formData.username);
        form.append('email', formData.email);
        form.append('dob', formData.dob);
        form.append('sex', formData.sex);
        form.append('accountType', formData.accountType);
        form.append('image', formData.image);

        try {
            await dispatch(UsersActions.update(idToEdit, form));
            Message('success', 'Profile was updated successfully', 5);
            
            getAuth();
        }catch (error){
            if(error.response.data && error.response.data.errors){
                let serverErrors = JSON.parse(error.response.data.errors);
                if(serverErrors["hydra:title"]){
                    serverErrorTitle = serverErrors["hydra:title"];
                    serverErrorDesc = serverErrors["hydra:description"];
                }else{
                    serverErrorDesc = serverErrors
                }
            }
            setErrors({
                title: serverErrorTitle,
                description: serverErrorDesc
            });
        }

        setLoading({
            ...loading, 
            action: false
        });
    }, [formData, dispatch, setLoading, loading, setErrors, errors, setFormData, setImgUrl]);

    const getAuth = useCallback(async (page = 1) => {
        setLoading({
            ...loading,
            content: true
        });

        try {
            await dispatch(UsersActions.auth());
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
            setErrors(clearErrors);
        }
        setLoading({
            ...loading,
            content: false
        });
    }, [dispatch, setLoading, loading, setErrors, Notification]);

    useEffect(() => {
        getAuth();
        getAccountTypes();
    }, []);

    useEffect(() => {
        if(Object.keys(user).length > 0){
            setFormData({
                ...formData,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                othernames: user.othernames,
                mobile: user.mobile,
                email: user.email,
                address: user.address,
                sex: user.sex,
                dob: user.dob,
                accountType: user.accountType['@id']
            });

            if(user.photo != ''){
                axios({
                    method: 'GET',
                    url: `${ENV.HOST}/uploads/user_avatars/${user.photo}`,
                    responseType: 'blob'
                })
                .then(response => {
                    getBase64(response.data);
                })
            }
        }
    }, [user]);

    return (
        <>
            <Breadcrumb
                pageTitle="Profile"
                addResource={() => setOpenAddModal(true)}
            />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <h3 className="title-5 m-b-35">Profile</h3>

                        <div className="row">
                            <div className="col-lg-4 col-md-4">
                                <div className="card">
                                    <div className="card-header">
                                        <strong className="card-title mb-3">Profile Card</strong>
                                    </div>
                                    {
                                        Object.keys(user).length > 0 ? 
                                        <div className="card-body">
                                            <div className="mx-auto d-block">
                                                { user.hasOwnProperty('photo') ? <img className="rounded-circle mx-auto d-block" style={{width: 130, height: 130}} src={`${ENV.HOST}/uploads/user_avatars/${user.photo}`} alt="Profile photo" /> : ''}<br />
                                                {
                                                    user.status ? <div className="text-center"><i style={{color: 'green'}} className="fa fa-circle"></i> Active</div> : <><i style={{color: 'red'}} className="fa fa-circle"></i> Blocked</>
                                                }
                                                <h5 className="text-sm-center mt-2 mb-1">{`${user.lastname} ${user.firstname} ${user.othernames}`}</h5><hr />
                                                <div className="location text-sm-center">
                                                    <i className="fa fa-map-marker"></i> {user.address}
                                                </div><hr />
                                                <div className="location text-sm-center">
                                                    <i className="fa fa-user"></i> {user.username}
                                                </div><hr />
                                                <div className="text-sm-center">
                                                    <i className="fa fa-envelope"></i> {user.email}
                                                </div><hr />
                                                <div className="text-sm-center">
                                                    <i className="fa fa-phone"></i> {user.mobile}
                                                </div><hr />
                                                <div className="text-sm-center">
                                                    <i className="fa fa-thumb-tack"></i> {user.accountType.title}
                                                </div><hr />
                                               
                                            </div>
                                            <hr />
                                            <div className="card-text text-sm-center">
                                               <p>Joined <span style={{color: 'green'}}><strong>{user.createdAtAgo}</strong></span></p>
                                            </div>
                                        </div>
                                        : <div className="text-center"><LoadingOutlined style={{color: 'blue'}} /></div>
                                    }
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-8">
                                <div className="card">
                                    <div className="card-header">
                                        <strong className="card-title mb-3">Update</strong>
                                    </div>
                                    {
                                        Object.keys(user).length > 0 ?
                                            <div className="card-body">
                                                <ValidationForm onSubmit={updateUser}>
                                                    <input style={{display: true && 'none'}} onChange={changeFormData} type="file" name="image" ref={fileInp} />
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div style={{display: "flex", justifyContent: "space-around"}}>
                                                                <UploadButton 
                                                                    loading={loading.upload}
                                                                    handleChange={onButtonClick}
                                                                    imgUrl={imgUrl}
                                                                    title="Upload avatar"
                                                                />
                                                        </div>
                                                        <div className="text-center">
                                                            <small style={{color: 'red'}}>{errors.file}</small>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="form-group">
                                                                <label htmlFor="firstname">Firstname</label>
                                                                <TextInput name="firstname" id="firstname" required
                                                                    value={formData.firstname}
                                                                    onChange={changeFormData}
                                                                    errorMessage={{required:"Please enter the name of firstname"}}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="form-group">
                                                                <label htmlFor="lastname">Lastname</label>
                                                                <TextInput name="lastname" id="lastname" required
                                                                    value={formData.lastname}
                                                                    onChange={changeFormData}
                                                                    errorMessage={{required:"Please enter the usernmae of user"}}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="form-group">
                                                                <label htmlFor="othernames">Othernames</label>
                                                                <TextInput name="othernames" id="othernames"
                                                                    value={formData.othernames}
                                                                    onChange={changeFormData}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="form-group">
                                                                <label htmlFor="username">Username</label>
                                                                <TextInput name="username" id="username"
                                                                    value={formData.username}
                                                                    onChange={changeFormData}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="form-group">
                                                                <label htmlFor="dob">dob</label>
                                                                <TextInput name="dob" id="dob" required type="date"
                                                                    value={formData.dob}
                                                                    onChange={changeFormData}
                                                                    errorMessage={{required:"Please enter the date of birth of user"}}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="form-group">
                                                                <label htmlFor="sex">sex</label>
                                                                <SelectGroup name="sex" id="sex"
                                                                    value={formData.sex}
                                                                    required
                                                                    errorMessage="Please a select a gender"
                                                                    onChange={changeFormData}
                                                                >
                                                                    <option value="">--- Please select ---</option>
                                                                    <option value="male">Male</option>
                                                                    <option value="female">Female</option>
                                                                </SelectGroup>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="form-group">
                                                                <label htmlFor="email">Email</label>
                                                                <TextInput name="email" id="email"
                                                                    value={formData.email}
                                                                    onChange={changeFormData}
                                                                    required
                                                                    errorMessage="Please enter an email"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="form-group">
                                                                <label htmlFor="accountType">Account Type</label>
                                                                <SelectGroup name="accountType" id="accountType"
                                                                    value={formData.accountType}
                                                                    required
                                                                    errorMessage="Please a select an account type"
                                                                    onChange={changeFormData}
                                                                >
                                                                    <option value="">--- Please select ---</option>
                                                                    {
                                                                        accountTypes.map((accType, index) => <option key={index} value={accType.iri}>{accType.title}</option>)
                                                                    }
                                                                </SelectGroup>
                                                            </div>
                                                        </div>
                                                    </div>
                                                
                                                    <div className="form-group float-right">
                                                        <button disabled={loading.action} className="btn btn-login">{ loading.action ? <><span>Saving</span> <Spin /></> : 'Update'}</button>
                                                    </div>
                                                </ValidationForm><br /><br /><hr /><hr />
                                                <ValidationForm onSubmit={changePassword}>
                                                    {
                                                        errorsPassword.description &&
                                                        <Alert 
                                                            className="text-center"
                                                            message={errorsPassword.title}
                                                            description={errorsPassword.description}
                                                            type="error"
                                                            closable
                                                            onClose={onClose}
                                                        />
                                                    }
                                                    <div className="row">
                                                        <div className="col-lg-4 col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="oldPassword">Old Password</label>
                                                                <TextInput name="oldPassword" id="oldPassword" required
                                                                    type="password"
                                                                    value={formData.oldPassword}
                                                                    onChange={changeFormData}
                                                                    errorMessage={{required:"Please enter your old password"}}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="newPassword">New Password</label>
                                                                <TextInput name="newPassword" id="newPassword" required
                                                                    type="password"
                                                                    value={formData.newPassword}
                                                                    onChange={changeFormData}
                                                                    errorMessage={{required:"Please enter your new password"}}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="confirmPassword">Confirm password</label>
                                                                <TextInput name="confirmPassword" id="confirmPassword" required
                                                                    type="password"
                                                                    value={formData.confirmPassword}
                                                                    onChange={changeFormData}
                                                                    validator={matchPassword}
                                                                    errorMessage={{required:"Confirm password is required", validator: "Password does not match"}}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                
                                                    <div className="form-group float-right">
                                                        <button disabled={loading.actionChangePassword} className="btn btn-login">{ loading.actionChangePassword ? <><span>Changing</span> <Spin /></> : 'Change'}</button>
                                                    </div>
                                                </ValidationForm>
                                            </div>
                                        :
                                        <div className="text-center"><LoadingOutlined style={{color: 'blue'}} /></div>
                                    }
                                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



export default Profile;