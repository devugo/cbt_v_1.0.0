import React, { useEffect, useCallback, useState, notificationef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Select, Button, Modal, Alert, Checkbox, Tag, Popconfirm, Popover, Upload, message, Tooltip, Input } from 'antd';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import BluetoothSearchingIcon from '@material-ui/icons/BluetoothSearching';
import Edit from '@material-ui/icons/Edit';
import { LoadingOutlined } from '@ant-design/icons';
import { ValidationForm, TextInput, SelectGroup } from 'react-bootstrap4-form-validation';
import Pagination from '@material-ui/lab/Pagination';

import * as NotificationsActions from '../../../store/actions/notifications';
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
    title: '',
    message: '',
    sentBy: '',
    sentTo: '',
    actionLink: ''
};

const clearErrors = {
    title: '',
    description: ''
};

const loaders = {
    content: true,
    action: false
}

let serverErrorTitle = ENV.ERRORTITLE;
let serverErrorDesc = ENV.ERRORDESC;

const Notifications = () => {

    const width = useWindowWidth();

    const users = useSelector(state => state.users.data);
    const notifications = useSelector(state => state.notifications.data);
    const [filteredNotifications, setFilteredNotifications] = useState(notifications);
    const totalNotifications = useSelector(state => state.notifications.count);
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
        getNotifications(pageNumber);
        setActivePage(pageNumber);
    }, [getNotifications, setActivePage]);

    //  Datatable
    const changeCheckbox = useCallback((id) => {
        let arr = [];
        if(id === 0){
            if(filteredNotifications.length === 0){return;}
            if(values.length !== filteredNotifications.length){
                filteredNotifications.map(x => arr.push(x.iri));
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
        arr.length === filteredNotifications.length ? setGlobal(true) : setGlobal(false);
    }, [filteredNotifications, values, setValues, global, setGlobal]);

    const isChecked = useCallback((val) => {
        // return values.indexOf(val);
        return values.some(x => x === val);
    }, [values]);

    // Close errors to clear errors
    const onClose = useCallback(() => {
        setErrors(clearErrors);
    }, [setErrors]);

     // image selector
     const onButtonClick = useCallback(() => {
        // `current` points to the mounted text input element
        fileInp.current.click();
    }, []);

    const changeFormData = useCallback((e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
    }, [formData, setFormData]);

    const changeEditContent = useCallback((val, data) => {
        setEditMode(true);
        getSingleNotification(val, data);
        setIdToEdit(val);
        setOpenAddModal(true);
    }, [setEditMode, getSingleNotification, setIdToDelete, setOpenDeleteModal]);

    const changeContent = useCallback((val) => {
        setValues([val]);
        setIdToDelete(val);
        setOpenDeleteModal(true);
    }, [setIdToDelete, setValues, setOpenDeleteModal]);

    const getSingleNotification = useCallback((val, data) => {
        let notification = data.find(notification => notification.id === val);

        setFormData({
            ...formData,
            title: notification.title,
            message: notification.message,
            sentBy: notification.sentBy,
            sentTo: notification.sentTo,
            actionLink: notification.actionLink
        });
       
    }, [formData, setFormData]);

    const deleteNotification = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });

        try {
            await dispatch(NotificationsActions.destroy(values));

            setOpenDeleteModal(false);
            values.length > 1 ? Message('success', 'Notifications were deleted successfully', 5) : Message('success', 'Notification was deleted successfully', 5);
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

    const updateNotification = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);

        try {
            await dispatch(NotificationsActions.update(idToEdit, formData));
            Message('success', 'Notification was updated successfully', 5);
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

    const createNotification = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);

        try {
            await dispatch(NotificationsActions.create(formData));
            Message('success', 'Notification was created successfully', 5);
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

    const getNotifications = useCallback(async (page = 1) => {
        setLoading({
            ...loading,
            content: true
        });

        try {
            await dispatch(NotificationsActions.read(page));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
            setErrors(clearErrors);
        }
        setLoading({
            ...loading,
            content: false
        });
    }, [dispatch, setLoading, loading, setErrors, Notification]);

    const getUsers = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(UsersActions.read(page, pagination));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);

    const changeFilteredMe = useCallback((e) => {
        setValues([]); setGlobal(false);
        let inputVal = e.target.value;
        setFilterMe(inputVal);
        let newFilterMe = []; // Store filter objects based on inputed fields

        notifications.map((notificationObj) => {
            Object.keys(notificationObj).map(key => {
                let single = notificationObj[key];
                let singleUpper = String(single).toUpperCase();
                let inputValUpper = String(inputVal).toUpperCase();

                if(singleUpper.indexOf(inputValUpper) !== -1){
                    newFilterMe.indexOf(notificationObj) == -1 ? newFilterMe.push(notificationObj) : null;
                }
            });
        });
        setFilteredNotifications(newFilterMe);
    }, [setValues, setGlobal, setFilterMe, notifications, setFilteredNotifications]);
    
    const renderTableData = () => {
        if (!filteredNotifications){
            return <tr className="text-center"><td colSpan={9}><Spin /></td></tr>
        }
        if(filteredNotifications.length === 0){
            return <tr className="text-center"><td colSpan={9}><strong><i>No record found!</i></strong></td></tr>
        }
        return filteredNotifications.map((notification, index) => {
            let checker = isChecked(notification.iri);
            return (
                <React.Fragment key={index}>
                    <tr className="tr-shadow">
                        <td>
                            <Checkbox
                                onChange={() => changeCheckbox(notification.iri)}
                                checked={checker}
                            />
                        </td>
                        <td>
                            {
                                activePage === 1 ? index + 1 : (index + 1 + itemsPerPage) + (itemsPerPage * (activePage - 2))
                            }
                        </td>
                        <td>{notification.title}</td>
                        <td>{notification.actionLink}</td>
                        <td>{notification.sentBy}</td>
                        <td>{notification.sentTo}</td>
                        <td>{notification.seenAtAgo}</td>
                        <td><Tag color="cyan">{notification.createdAtAgo}</Tag></td>
                        <td>
                            <Tooltip placement="top" title="Edit notification"><Edit onClick={() => changeEditContent(notification.id, notifications)} style={{cursor: "pointer"}} color="primary" /></Tooltip>
                            <Tooltip placement="top" title="Delete notification"><DeleteForeverSharpIcon onClick={()=>changeContent(notification.iri)} style={{cursor: "pointer"}} color="secondary" /></Tooltip>
                        </td>
                    </tr>
                    <tr className="spacer"></tr>
                </React.Fragment>
            )
        })
    }

    useEffect(() => {
        getNotifications();
        getUsers();
    }, []);

    useEffect(() => {
        setFilteredNotifications(notifications);
    }, [notifications]);

    return (
        <>
            <Breadcrumb 
                pageTitle="Notifications"
                addResource={() => setOpenAddModal(true)}
            />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="title-5 m-b-35">Notifications</h3>
                        {
                            loading.content ?
                            <div className="text-center"><LoadingOutlined style={{color: 'blue'}} /></div> :
                            <>
                                <div className="col-lg-3 col-md-4">
                                    <Input placeholder="Search notification..." allowClear value={filterMe} onChange={changeFilteredMe} />
                                </div>
                                <div className="table-responsive table-responsive-data2">
                                    <table className="table table-data2">
                                        <thead>
                                            {
                                                values.length > 0 &&
                                                <tr>
                                                    <th colSpan={5}><i>{values.length} item(s) selected</i></th>
                                                    <th>
                                                        {
                                                        loading.action ? 
                                                            <LoadingOutlined style={{color: 'blue'}} /> :
                                                            <Tooltip placement="top" title="Delete multiple account types">
                                                                <QuickConfirm
                                                                    title="Delete All?"
                                                                    color="red"
                                                                    tagName="Delete"
                                                                    ok={deleteNotification}
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
                                                        indeterminate={filteredNotifications && values.length > 0 && values.length !== filteredNotifications.length}
                                                    />
                                                </th>
                                                <th>#</th>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>Created</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderTableData()}
                                        </tbody>
                                    </table>
                                    {
                                        filteredNotifications && filteredNotifications.length > 0 &&
                                        <div style={{display: 'flex', justifyContent: 'space-between'}} className="">
                                            <p>Showing {((itemsPerPage * activePage) - itemsPerPage) + 1} to {(notifications.length * activePage) + ((itemsPerPage - notifications.length) * (activePage - 1))} of {totalNotifications} entries</p>
                                             <div>
                                                <Pagination count={Math.ceil(totalNotifications/itemsPerPage)} page={activePage} onChange={handlePageChange} color="primary" />
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
                onCancel={() => {setErrors(clearErrors), setValues([]), setOpenDeleteModal(false)}}
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
                            <Button onClick={deleteNotification} type="primary">Delete</Button>
                            <Button onClick={() => {setOpenDeleteModal(false)}}>Cancel</Button>
                        </>
                    }
                    
                </div>
            </Modal>
            
            <Modal
                title={ editMode ? 'Update notification' : 'Add notification' }
                centered
                visible={openAddModal}
                onCancel={() => {setOpenAddModal(false); setEditMode(false); setFormData(emptyFormData), setErrors(clearErrors), setIdToEdit()}}
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
                <ValidationForm onSubmit={editMode ? updateNotification : createNotification}>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="title">Name of notification</label>
                                <TextInput name="title" id="title" required
                                    value={formData.title}
                                    onChange={changeFormData}
                                    errorMessage={{required:"Please enter the title of notification"}}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <TextInput name="message" id="message" multiline required
                                    errorMessage={{required:"Please enter the message of notification"}}
                                    row={4}
                                    value={formData.message}
                                    onChange={changeFormData}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="actionLink">Action Link</label>
                                <TextInput name="actionLink" id="actionLink"
                                    value={formData.actionLink}
                                    onChange={changeFormData}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="sentTo">User</label>
                                <SelectGroup name="sentTo" id="sentTo"
                                    value={formData.sentTo}
                                    required
                                    errorMessage="Please a select the user notification is being sent to"
                                    onChange={changeFormData}
                                >
                                    <option value="">--- Please select ---</option>
                                    {
                                        users.map((user, index) => <option key={index} value={user.iri}>{user.username}</option>)
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



export default Notifications;