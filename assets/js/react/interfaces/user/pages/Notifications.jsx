import React, { useEffect, useCallback, useState, notificationef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Select, Button, Modal, Alert, Checkbox, Tag, Popconfirm, Popover, Upload, message, Tooltip, Input } from 'antd';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import BookRoundedIcon from '@material-ui/icons/BookRounded';
import BookSharpIcon from '@material-ui/icons/BookSharp';
import BluetoothSearchingIcon from '@material-ui/icons/BluetoothSearching';
import Edit from '@material-ui/icons/Edit';
import { LoadingOutlined } from '@ant-design/icons';
import { ValidationForm, TextInput, SelectGroup } from 'react-bootstrap4-form-validation';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InputMat from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import SelectMat from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

import * as NotificationsActions from '../../../store/actions/notifications';
import * as UsersActions from '../../../store/actions/users';
import * as AccountTypesActions from '../../../store/actions/account-types';
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
    actionLink: ''
};

const clearErrors = {
    title: '',
    description: '',
    selectUser: ''
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
    const [viewModal, setViewModal] = useState(false);
    const [idToView, setIdToView] = useState(false);

    const [formData, setFormData] = useState(emptyFormData);
    const [loading, setLoading] = useState(loaders);
    const [filterMe, setFilterMe] = useState("");
    const [activePage, setActivePage] = useState(1);

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

    const viewNotification = (id) => {
        setIdToView(id);
        setViewModal(true);
        markNotification(id);
    }
    const markNotification = useCallback(async (val) => {
        try {
            await dispatch(NotificationsActions.mark(val));
        }catch(error){
        }
    }, [dispatch]);

    const getNotifications = useCallback(async (page = 1) => {
        setLoading({
            ...loading,
            content: true
        });

        try {
            await dispatch(NotificationsActions.read(page, true, ENV.IRI));
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

    const getUsername = useCallback((iri) => {
        const user = users.find(user => user.iri === iri);
        return user && user.username;
    }, [users]);

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
            return <tr className="text-center"><td colSpan={8}><Spin /></td></tr>
        }
        if(filteredNotifications.length === 0){
            return <tr className="text-center"><td colSpan={8}><strong><i>No record found!</i></strong></td></tr>
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
                        <td>{getUsername(notification.sentBy)}</td>
                        <td><Tag color="cyan">{notification.createdAtAgo}</Tag></td>
                        <td>{notification.seenAtAgo && <Tag color="cyan">{notification.seenAtAgo}</Tag>}</td>
                        <td>
                            <Tooltip placement="top" title="View notification"><BookRoundedIcon onClick={()=>viewNotification(notification.id)} style={{cursor: "pointer", color: 'green'}} color="secondary" /></Tooltip>
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
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="title-5 m-b-35">Notifications</h3>
                        {
                            loading.content ?
                            <div className="text-center"><LoadingOutlined style={{color: 'blue', fontSize: 50}} /></div> :
                            <>
                                <div className="row">
                                    <div className="col-lg-3 col-md-4">
                                        <Input placeholder="Search notification..." allowClear value={filterMe} onChange={changeFilteredMe} />
                                    </div>
                                </div>
                                <div className="table-responsive table-responsive-data2">
                                    <table className="table table-data2">
                                        <thead>
                                            {
                                                values.length > 0 &&
                                                <tr>
                                                    <th colSpan={7}><i>{values.length} item(s) selected</i></th>
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
                                                <th>Sent By</th>
                                                <th>Sent At</th>
                                                <th>Seen At</th>
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
                title="Viewing Notification"
                centered
                visible={viewModal}
                zIndex={1000}
                footer={null}
                onCancel={() => {setViewModal(false)}}
            >
                {
                    idToView &&
                    <div>
                        <div>
                            <h3>{notifications.find(noti => noti.id == idToView).title}</h3>
                        </div><br />
                        <div>
                            <p>{notifications.find(noti => noti.id == idToView).message}</p>
                        </div>
                        <div>
                            {notifications.find(noti => noti.id == idToView).actionLink && <small>Check out link <a target="_blank" href={notifications.find(noti => noti.id == idToView).actionLink}>here</a></small>}
                        </div><hr />
                        <div>
                            <p><strong>By:</strong> <span>{getUsername(notifications.find(noti => noti.id == idToView).sentBy)}</span> | <span><i>{notifications.find(noti => noti.id == idToView).createdAtAgo}</i></span></p> 
                        </div>
                    </div>
                }
            </Modal>
        </>
    )
}



export default Notifications;