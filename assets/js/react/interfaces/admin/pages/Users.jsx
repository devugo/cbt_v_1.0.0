import React, { useEffect, useCallback, useState, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Spin, Select, Button, Modal, Alert, Checkbox, Tag, Popconfirm, Popover, Upload, message, Tooltip, Input } from 'antd';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import Edit from '@material-ui/icons/Edit';
import { LoadingOutlined } from '@ant-design/icons';
import { ValidationForm, TextInput, SelectGroup } from 'react-bootstrap4-form-validation';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import * as UsersActions from '../../../store/actions/users';
import * as AccountTypesActions from '../../../store/actions/account-types';
import Breadcrumb from '../components/Breadcrumb';
import useWindowWidth from '../../../helpers/hooks/useWindowWidth';
import UploadButton from '../../../UIElements/UploadButton';
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
    username: '',
    dob: '',
    sex: '',
    accountType: '',
    email: '',
    image: ''
};

const clearErrors = {
    title: '',
    description: '',
    file: ''
};

const loaders = {
    content: true,
    action: false,
    upload: false
}

let serverErrorTitle = ENV.ERRORTITLE;
let serverErrorDesc = ENV.ERRORDESC;

const useStyles = makeStyles(theme => ({
    root: {
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const Users = () => {

    const classes = useStyles();
    const fileInp = useRef(null);
    const width = useWindowWidth();

    const users = useSelector(state => state.users.data);
    const [filteredUsers, setFilteredUsers] = useState(users);
    const totalUsers = useSelector(state => state.users.count);
    const accountTypes = useSelector(state => state.accountTypes.data);
    const dispatch = useDispatch();
    
    // Datatable states
    const [values, setValues] = useState([]);
    const [global, setGlobal] = useState(false);

    const [errors, setErrors] = useState(clearErrors);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [formData, setFormData] = useState(emptyFormData);
    const [loading, setLoading] = useState(loaders);
    const [imgUrl, setImgUrl] = useState();
    const [filterMe, setFilterMe] = useState("");
    const [activePage, setActivePage] = useState(1);

    const [editMode, setEditMode] = useState(false);
    const [idToEdit, setIdToEdit] = useState();

    const [idToDelete, setIdToDelete] = useState();

    //  Pagination
    const handlePageChange = useCallback((event, pageNumber) => {
        getUsers(pageNumber);
        setActivePage(pageNumber);
    }, [getUsers, setActivePage]);

    //  Datatable
    const changeCheckbox = useCallback((id) => {
        let arr = [];
        if(id === 0){
            if(filteredUsers.length === 0){return;}
            if(values.length !== filteredUsers.length){
                filteredUsers.map(x => arr.push(x.iri));
            }
        }else{
            arr = [...values];
            if(arr.indexOf(id) === -1){
                arr.push(id);
            }else{
                arr = arr.filter(x => x !== id);
            }
        }

        setValues(arr);
        arr.length === filteredUsers.length ? setGlobal(true) : setGlobal(false);
    }, [filteredUsers, values, setValues, global, setGlobal]);

    const isChecked = useCallback((val) => {
        // return values.indexOf(val);
        return values.some(x => x === val);
    }, [values]);

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
                    file: 'The maximum logo size is 500KB'
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
        
    }, [formData]);

    const changeEditContent = useCallback((val, data) => {
        setEditMode(true);
        getSingleUser(val, data);
        setIdToEdit(val);
        setOpenAddModal(true);
    }, [setEditMode, getSingleUser, setIdToDelete, setOpenDeleteModal]);

    const changeContent = useCallback((val) => {
        setValues([val]);
        setIdToDelete(val);
        setOpenDeleteModal(true);
    }, [setIdToDelete, setValues, setOpenDeleteModal]);

    const getSingleUser = useCallback((val, data) => {
        let user = data.find(user => user.id === val);

        setFormData({
            ...formData,
            firstname: user.firstname,
            lastname: user.lastname,
            othernames: user.othernames,
            photo: user.photo,
            username: user.username,
            email: user.email,
            dob: user.dob,
            sex: user.sex,
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
       
    }, [users, formData, setFormData, getBase64]);

    const activateUser = useCallback(async (user, value) => {

        setLoading({
            ...loading,
            content: true
        });
        try {
            await dispatch(UsersActions.activate(user, value));

            Message('success', value === 'activate' ? 'User was activated successfully' : 'User was blocked successfully', 10);
            setValues([]);
            setGlobal(false);
        }catch(error){
            Message('error', 'There was an error activating user', 10);
        }
        setLoading({
            ...loading, 
            content: false
        });
    }, [setLoading, loading, dispatch, setValues, setGlobal]);

    const deleteUser = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });

        try {
            await dispatch(UsersActions.destroy(values));

            setOpenDeleteModal(false);
            values.length > 1 ? Message('success', 'Users were deleted successfully', 5) : Message('success', 'User was deleted successfully', 5);
            setValues([]);
            setGlobal(false);
        }catch(error){
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
        setIdToDelete();
    }, [setLoading, loading, setOpenDeleteModal, dispatch, setValues, setGlobal, values, setIdToDelete, setErrors]);

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
            Message('success', 'User was updated successfully', 5);
            setOpenAddModal(false);
            setFormData(emptyFormData);
            setImgUrl();
            setEditMode(false);
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

    const createUser = useCallback(async (e) => {
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
            await dispatch(UsersActions.create(form));
            Message('success', 'User was created successfully', 5);
            setFormData(emptyFormData);
            setImgUrl();
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

    const getUsers = useCallback(async (page = 1) => {
        // setFilteredUsers(); setUsers(); 
        setLoading({
            ...loading,
            content: true
        });

        try {
            await dispatch(UsersActions.read(page));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
            setErrors(clearErrors);
        }
        setLoading({
            ...loading,
            content: false
        });
    }, [dispatch, setLoading, loading, setErrors, Notification]);

    const getAccountTypes = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(AccountTypesActions.read(page, pagination));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);

    const changeFilteredMe = useCallback((e) => {
        setValues([]); setGlobal(false);
        let inputVal = e.target.value;
        setFilterMe(inputVal);
        let newFilterMe = []; // Store filter objects based on inputed fields

        users.map((userObj) => {
            Object.keys(userObj).map(key => {
                let single = userObj[key];
                let singleUpper = String(single).toUpperCase();
                let inputValUpper = String(inputVal).toUpperCase();

                if(singleUpper.indexOf(inputValUpper) !== -1){
                    newFilterMe.indexOf(userObj) == -1 ? newFilterMe.push(userObj) : null;
                }
            });
        });
        setFilteredUsers(newFilterMe);
    }, [setValues, setGlobal, setFilterMe, users, setFilteredUsers]);
    
    const renderTableData = () => {
        if (!filteredUsers){
            return <tr className="text-center"><td colSpan={9}><Spin /></td></tr>
        }
        if(filteredUsers.length === 0){
            return <tr className="text-center"><td colSpan={9}><strong><i>No record found!</i></strong></td></tr>
        }
        return filteredUsers.map((user, index) => {
            let checker = isChecked(user.iri);
            return (
                <React.Fragment key={index}>
                    <tr className="tr-shadow">
                        <td style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <Checkbox
                                onChange={() => changeCheckbox(user.iri)}
                                checked={checker}
                            />
                        </td>
                        <td>
                            {
                                activePage === 1 ? index + 1 : (index + 1 + itemsPerPage) + (itemsPerPage * (activePage - 2))
                            }
                        </td>
                        <td>{ user.photo ? <img style={{borderRadius: '50%', height: 35, width: 35}} src={`${ENV.HOST}/uploads/user_avatars/${user.photo}`} alt="user photo" /> : ''}</td>
                        <td>{user.name}</td>
                        <td><span className="block-email">{user.email}</span></td>
                        <td>{user.sex}</td>
                        <td><Tag color="cyan">{user.createdAtAgo}</Tag></td>
                        <td>
                            {
                                !user.status ? 
                                    <Tooltip placement="top" title="Activate user?">
                                        <QuickConfirm
                                            title="Activate user?"
                                            color="red"
                                            tagName="Blocked"
                                            ok={() => activateUser(user.id, 'activate')}
                                        />
                                    </Tooltip>
                                :
                                <Tooltip placement="top" title="Block user?">
                                <QuickConfirm
                                    title="Block user?"
                                    color="green"
                                    tagName="Active"
                                    ok={() => activateUser(user.id, 'block')}
                                />
                            </Tooltip>
                            //  <Tag color="green">Active</Tag>
                            }
                            
                        </td>
                        <td>
                            <Tooltip placement="top" title="Edit user"><Edit onClick={() => changeEditContent(user.id, users)} style={{cursor: "pointer"}} color="primary" /></Tooltip>
                            <Tooltip placement="top" title="Delete user"><DeleteForeverSharpIcon onClick={()=>changeContent(user.iri)} style={{cursor: "pointer"}} color="secondary" /></Tooltip>
                        </td>
                    </tr>
                    <tr className="spacer"></tr>
                </React.Fragment>
            )
        })
    }

    useEffect(() => {
        getUsers();
        getAccountTypes();
    }, []);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    return (
        <>
            <Breadcrumb 
                pageTitle="Users"
                addResource={() => setOpenAddModal(true)}
            />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="title-5 m-b-35">Users</h3>
                        {
                            loading.content ?
                            <div className="text-center"><LoadingOutlined style={{color: 'blue'}} /></div> :
                            <>
                                <div className="col-lg-3 col-md-4">
                                    <Input placeholder="Search user..." allowClear value={filterMe} onChange={changeFilteredMe} />
                                </div>
                                <div className="table-responsive table-responsive-data2">
                                    <table className="table table-data2">
                                        <thead>
                                            {
                                                values.length > 0 &&
                                                <tr>
                                                    <th colSpan={8}><i>{values.length} item(s) selected</i></th>
                                                    <th>
                                                        {
                                                        loading.action ? 
                                                            <LoadingOutlined style={{color: 'blue'}} /> :
                                                            <Tooltip placement="top" title="Delete multiple account types">
                                                                <QuickConfirm
                                                                    title="Delete All?"
                                                                    color="red"
                                                                    tagName="Delete"
                                                                    ok={deleteUser}
                                                                />
                                                            </Tooltip>
                                                        } 
                                                    </th>
                                                </tr>
                                            }
                                            <tr>
                                                <th>
                                                    <Checkbox
                                                        onChange={() => changeCheckbox(0)}
                                                        checked={global}
                                                        indeterminate={filteredUsers && values.length > 0 && values.length !== filteredUsers.length}
                                                    />
                                                </th>
                                                <th>#</th>
                                                <th>Photo</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Sex</th>
                                                <th>Created</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderTableData()}
                                        </tbody>
                                    </table>
                                    {
                                        filteredUsers && filteredUsers.length > 0 &&
                                        <div style={{display: 'flex', justifyContent: 'space-between'}} className="">
                                            <p>Showing {((itemsPerPage * activePage) - itemsPerPage) + 1} to {(users.length * activePage) + ((itemsPerPage - users.length) * (activePage - 1))} of {totalUsers} entries</p>
                                            {/* <Paginate
                                                activePage={activePage}
                                                itemsPerPage={itemsPerPage}
                                                totalItems={totalUsers}
                                                rangeDisplay={rangeDisplay}
                                                handlePageChange={handlePageChange}
                                            /> */}
                                            <div className={classes.root}>
                                                <Pagination count={Math.ceil(totalUsers/itemsPerPage)} page={activePage} onChange={handlePageChange} color="primary" />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <Modal
                title="Are you sure you want to delete? "
                centered
                visible={openDeleteModal}
                zIndex={1000}
                footer={null}
                onCancel={() => {setValues([]), setOpenDeleteModal(false)}}
            >
                {
                    errors.description &&
                    <Alert 
                        className="text-center"
                        message={errors.title}
                        description={errors.description}
                        type="error"
                        closable
                        onClose={onClose}
                    />
                }
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    {
                        loading.action ?
                        <LoadingOutlined style={{color: 'blue'}} /> :
                        <>
                            <Button onClick={deleteUser} type="primary">Delete</Button>
                            <Button onClick={() => {setOpenDeleteModal(false)}}>Cancel</Button>
                        </>
                    }
                    
                </div>
            </Modal>
            
            <Modal
                title={ editMode ? 'Update user' : 'Add user' }
                centered
                visible={openAddModal}
                onCancel={() => {setOpenAddModal(false); setEditMode(false); setFormData(emptyFormData), setImgUrl(''), setIdToEdit()}}
                footer={null}
                zIndex={1000}
                width={width > 1024 ? '70%' : width > 768 ? '80%' : width > 360 ? '90%' : '100%'}
            >
                {
                    errors.description &&
                    <Alert 
                        className="text-center"
                        message={errors.title}
                        description={errors.description}
                        type="error"
                        closable
                        onClose={onClose}
                    />
                }
                <ValidationForm onSubmit={editMode ? updateUser : createUser}>
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
                                    errorMessage="Please a select an accont type"
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
                        <button disabled={loading.action} className="btn btn-login">{ loading.action ? <><span>Saving</span> <Spin /></> : editMode ? 'Update' : "Save" }</button>
                    </div>
                </ValidationForm><br /><br />
            </Modal>
        </>
    )
}



export default Users;