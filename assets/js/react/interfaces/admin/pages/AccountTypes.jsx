import React, { useEffect, useCallback, useState, useRef, Fragment} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Select, Button, Modal, Alert, Checkbox, Tag, Popconfirm, Popover, Upload, message, Tooltip, Input } from 'antd';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import BluetoothSearchingIcon from '@material-ui/icons/BluetoothSearching';
import Edit from '@material-ui/icons/Edit';
import { LoadingOutlined } from '@ant-design/icons';
import { ValidationForm, TextInput, SelectGroup } from 'react-bootstrap4-form-validation';
import Pagination from '@material-ui/lab/Pagination';

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
    description: '',
    usersPrivileges: {
        create: false,
        read: false,
        update: false,
        delete: false
    },
    subjectsPrivileges: {
        create: false,
        read: false,
        update: false,
        delete: false
    },
    questionsPrivileges: {
        create: false,
        read: false,
        update: false,
        delete: false
    },
    notificationsPrivileges: {
        create: false,
        read: false,
        update: false,
        delete: false
    },
    levelsPrivileges: {
        create: false,
        read: false,
        update: false,
        delete: false
    },
    accountTypesPrivileges: {
        create: false,
        read: false,
        update: false,
        delete: false
    },
    userGroupsPrivileges: {
        create: false,
        read: false,
        update: false,
        delete: false
    }
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

const AccountTypes = () => {

    const width = useWindowWidth();
    const firstInput = useRef(null);

    const accountTypes = useSelector(state => state.accountTypes.data);
    const filteredAccountTypes = useSelector(state => state.accountTypes.data);
    const totalAccountTypes = useSelector(state => state.accountTypes.count);
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
        getAccountTypes(pageNumber);
        setActivePage(pageNumber);
    }, [getAccountTypes, setActivePage]);

    //  Datatable
    const changeCheckbox = useCallback((id) => {
        let arr = [];
        if(id === 0){
            if(filteredAccountTypes.length === 0){return;}
            if(values.length !== filteredAccountTypes.length){
                filteredAccountTypes.map(x => arr.push(x.iri));
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
        arr.length === filteredAccountTypes.length ? setGlobal(true) : setGlobal(false);
    }, [filteredAccountTypes, values, setValues, setGlobal]);

    const isChecked = useCallback((val) => {
        // return values.indexOf(val);
        return values.some(x => x === val);
    }, [values]);

    // Close errors to clear errors
    const onClose = useCallback(() => {
        setErrors(clearErrors);
    }, [setErrors]);

    const changeCheckboxForm = useCallback((type) => {
        // console.log(formData);
        switch(type){
            case 'users_create':
                setFormData({
                    ...formData,
                    usersPrivileges: {
                        ...formData.usersPrivileges,
                        create: !formData.usersPrivileges.create
                    }
                })
                break;
            case 'users_read':
                setFormData({
                    ...formData,
                    usersPrivileges: {
                        ...formData.usersPrivileges,
                        read: !formData.usersPrivileges.read
                    }
                })
                break;
            case 'users_update':
                setFormData({
                    ...formData,
                    usersPrivileges: {
                        ...formData.usersPrivileges,
                        update: !formData.usersPrivileges.update
                    }
                })
                break;
            case 'users_delete':
                setFormData({
                    ...formData,
                    usersPrivileges: {
                        ...formData.usersPrivileges,
                        delete: !formData.usersPrivileges.delete
                    }
                })
                break;
            case 'questions_create':
                setFormData({
                    ...formData,
                    questionsPrivileges: {
                        ...formData.questionsPrivileges,
                        create: !formData.questionsPrivileges.create
                    }
                })
                break;
            case 'questions_read':
                setFormData({
                    ...formData,
                    questionsPrivileges: {
                        ...formData.questionsPrivileges,
                        read: !formData.questionsPrivileges.read
                    }
                })
                break;
            case 'questions_update':
                setFormData({
                    ...formData,
                    questionsPrivileges: {
                        ...formData.questionsPrivileges,
                        update: !formData.questionsPrivileges.update
                    }
                })
                break;
            case 'questions_delete':
                setFormData({
                    ...formData,
                    questionsPrivileges: {
                        ...formData.questionsPrivileges,
                        delete: !formData.questionsPrivileges.delete
                    }
                })
                break;
            case 'subjects_create':
                setFormData({
                    ...formData,
                    subjectsPrivileges: {
                        ...formData.subjectsPrivileges,
                        create: !formData.subjectsPrivileges.create
                    }
                })
                break;
            case 'subjects_read':
                setFormData({
                    ...formData,
                    subjectsPrivileges: {
                        ...formData.subjectsPrivileges,
                        read: !formData.subjectsPrivileges.read
                    }
                })
                break;
            case 'subjects_update':
                setFormData({
                    ...formData,
                    subjectsPrivileges: {
                        ...formData.subjectsPrivileges,
                        update: !formData.subjectsPrivileges.update
                    }
                })
                break;
            case 'subjects_delete':
                setFormData({
                    ...formData,
                    subjectsPrivileges: {
                        ...formData.subjectsPrivileges,
                        delete: !formData.subjectsPrivileges.delete
                    }
                })
                break;
            case 'notifications_create':
                setFormData({
                    ...formData,
                    notificationsPrivileges: {
                        ...formData.notificationsPrivileges,
                        create: !formData.notificationsPrivileges.create
                    }
                })
                break;
            case 'notifications_read':
                setFormData({
                    ...formData,
                    notificationsPrivileges: {
                        ...formData.notificationsPrivileges,
                        read: !formData.notificationsPrivileges.read
                    }
                })
                break;
            case 'notifications_update':
                setFormData({
                    ...formData,
                    notificationsPrivileges: {
                        ...formData.notificationsPrivileges,
                        update: !formData.notificationsPrivileges.update
                    }
                })
                break;
            case 'notifications_delete':
                setFormData({
                    ...formData,
                    notificationsPrivileges: {
                        ...formData.notificationsPrivileges,
                        delete: !formData.notificationsPrivileges.delete
                    }
                })
                break;
            case 'levels_create':
                setFormData({
                    ...formData,
                    levelsPrivileges: {
                        ...formData.levelsPrivileges,
                        create: !formData.levelsPrivileges.create
                    }
                })
                break;
            case 'levels_read':
                setFormData({
                    ...formData,
                    levelsPrivileges: {
                        ...formData.levelsPrivileges,
                        read: !formData.levelsPrivileges.read
                    }
                })
                break;
            case 'levels_update':
                setFormData({
                    ...formData,
                    levelsPrivileges: {
                        ...formData.levelsPrivileges,
                        update: !formData.levelsPrivileges.update
                    }
                })
                break;
            case 'levels_delete':
                setFormData({
                    ...formData,
                    levelsPrivileges: {
                        ...formData.levelsPrivileges,
                        delete: !formData.levelsPrivileges.delete
                    }
                })
                break;
            
            case 'account_types_create':
                setFormData({
                    ...formData,
                    accountTypesPrivileges: {
                        ...formData.accountTypesPrivileges,
                        create: !formData.accountTypesPrivileges.create
                    }
                })
            break;
            case 'account_types_read':
                setFormData({
                    ...formData,
                    accountTypesPrivileges: {
                        ...formData.accountTypesPrivileges,
                        read: !formData.accountTypesPrivileges.read
                    }
                })
            break;
            case 'account_types_update':
                setFormData({
                    ...formData,
                    accountTypesPrivileges: {
                        ...formData.accountTypesPrivileges,
                        update: !formData.accountTypesPrivileges.update
                    }
                })
            break;
            case 'account_types_delete':
                setFormData({
                    ...formData,
                    accountTypesPrivileges: {
                        ...formData.accountTypesPrivileges,
                        delete: !formData.accountTypesPrivileges.delete
                    }
                })
            break;

            case 'user_groups_create':
                setFormData({
                    ...formData,
                    userGroupsPrivileges: {
                        ...formData.userGroupsPrivileges,
                        create: !formData.userGroupsPrivileges.create
                    }
                })
            break;
            case 'user_groups_read':
                setFormData({
                    ...formData,
                    userGroupsPrivileges: {
                        ...formData.userGroupsPrivileges,
                        read: !formData.userGroupsPrivileges.read
                    }
                })
            break;
            case 'user_groups_update':
                setFormData({
                    ...formData,
                    userGroupsPrivileges: {
                        ...formData.userGroupsPrivileges,
                        update: !formData.userGroupsPrivileges.update
                    }
                })
            break;
            case 'user_groups_delete':
                setFormData({
                    ...formData,
                    userGroupsPrivileges: {
                        ...formData.userGroupsPrivileges,
                        delete: !formData.userGroupsPrivileges.delete
                    }
                })
            break;
        }
    }, [setFormData, formData])

    const changeFormData = useCallback((e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
    }, [formData, setFormData]);

    const changeEditContent = useCallback((val, data) => {
        setEditMode(true);
        getSingleAccountType(val, data);
        setIdToEdit(val);
        setOpenAddModal(true);
    }, [setEditMode, getSingleAccountType, setIdToEdit, setOpenAddModal]);

    const changeContent = useCallback((val) => {
        // return console.log(val);
        setValues([val]);
        setIdToDelete(val);
        setOpenDeleteModal(true);
    }, [setIdToDelete, setOpenDeleteModal, setValues]);

    const getSingleAccountType = useCallback((val, data) => {
        // console.log(val);
        // return console.log(data);
        let accType = data.find(acc => acc.id === val);

        setFormData({
            ...formData,
            title: accType.title.replace("ROLE_", ""),
            description: accType.description,
            usersPrivileges: accType.usersPrivileges,
            subjectsPrivileges: accType.subjectsPrivileges,
            questionsPrivileges: accType.questionsPrivileges,
            notificationsPrivileges: accType.notificationsPrivileges,
            levelsPrivileges: accType.levelsPrivileges,
            accountTypesPrivileges: accType.accountTypesPrivileges,
            userGroupsPrivileges: accType.userGroupsPrivileges
        });
    }, [accountTypes, formData, setFormData]);

    const deleteAccountType = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });

        try {
            await dispatch(AccountTypesActions.destroy(values));

            setOpenDeleteModal(false);
            values.length > 1 ? Message('success', 'Account Types were deleted successfully', 5) : Message('success', 'Account Type was deleted successfully', 5);
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

    const updateAccountType = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);
        try {
            await dispatch(AccountTypesActions.update(idToEdit, formData));
            setOpenAddModal(false);
            Message('success', 'Account type was updated successfully', 5);
            setFormData(emptyFormData);
            setEditMode(false);
        }catch(error){
            if(error.response.data && error.response.data.errors){
                let serverErrors = JSON.parse(error.response.data.errors);
                serverErrorTitle = serverErrors["hydra:title"];
                serverErrorDesc = serverErrors["hydra:description"];
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
    },[loading, setLoading, errors, setErrors, dispatch, setOpenAddModal, idToEdit, formData, setFormData]);
    
    const createAccountType = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        try {
            await dispatch(AccountTypesActions.create(formData));
            Message('success', 'Account Type was created successfully', 5);
            setFormData(emptyFormData);
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
        })
    }, [setLoading, formData, setFormData, loading, dispatch, errors, setErrors]);

    const getAccountTypes = useCallback(async (page = 1) => {
        // setFilteredUsers(); setUsers(); 
        setLoading({
            ...loading,
            content: true
        });

        try {
            await dispatch(AccountTypesActions.read(page));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
        setLoading({
            ...loading,
            content: false
        });
    }, [dispatch, setLoading, setErrors, loading, Notification]);

    const renderTableData = () => {
        if (!filteredAccountTypes){
            return <tr className="text-center"><td colSpan={10}><Spin /></td></tr>
        }
        if(filteredAccountTypes.length === 0){
            return <tr className="text-center"><td colSpan={10}><strong><i>No record found!</i></strong></td></tr>
        }
        return filteredAccountTypes.map((accType, index) => {
            let checker = isChecked(accType.iri);

            let usersPrivileges = Object.keys(accType.usersPrivileges).map((key, index) => accType.usersPrivileges[key] === true ? <Tag key={index} style={{fontSize: 8}} color={ key === 'read' ? 'blue' : key === 'create' ? 'green' : key === 'update' ? 'yellow' : key === 'delete' ? 'red' : null}>{key}</Tag> : '')
            let subjectsPrivileges = Object.keys(accType.subjectsPrivileges).map((key, index) => accType.subjectsPrivileges[key] === true ? <Tag key={index} style={{fontSize: 8}} color={ key === 'read' ? 'blue' : key === 'create' ? 'green' : key === 'update' ? 'yellow' : key === 'delete' ? 'red' : null}>{key}</Tag> : '')
            let questionsPrivileges = Object.keys(accType.questionsPrivileges).map((key, index) => accType.questionsPrivileges[key] === true ? <Tag key={index} style={{fontSize: 8}} color={ key === 'read' ? 'blue' : key === 'create' ? 'green' : key === 'update' ? 'yellow' : key === 'delete' ? 'red' : null}>{key}</Tag> : '')
            let notificationsPrivileges = Object.keys(accType.notificationsPrivileges).map((key, index) => accType.notificationsPrivileges[key] === true ? <Tag key={index} style={{fontSize: 8}} color={ key === 'read' ? 'blue' : key === 'create' ? 'green' : key === 'update' ? 'yellow' : key === 'delete' ? 'red' : null}>{key}</Tag> : '')
            let levelsPrivileges = Object.keys(accType.levelsPrivileges).map((key, index) => accType.levelsPrivileges[key] === true ? <Tag key={index} style={{fontSize: 8}} color={ key === 'read' ? 'blue' : key === 'create' ? 'green' : key === 'update' ? 'yellow' : key === 'delete' ? 'red' : null}>{key}</Tag> : '')
            let accountTypesPrivileges = Object.keys(accType.accountTypesPrivileges).map((key, index) => accType.accountTypesPrivileges[key] === true ? <Tag key={index} style={{fontSize: 8}} color={ key === 'read' ? 'blue' : key === 'create' ? 'green' : key === 'update' ? 'yellow' : key === 'delete' ? 'red' : null}>{key}</Tag> : '')
            let userGroupsPrivileges = Object.keys(accType.userGroupsPrivileges).map((key, index) => accType.userGroupsPrivileges[key] === true ? <Tag key={index} style={{fontSize: 8}} color={ key === 'read' ? 'blue' : key === 'create' ? 'green' : key === 'update' ? 'yellow' : key === 'delete' ? 'red' : null}>{key}</Tag> : '')

            return (
                <Fragment key={index}>
                    <tr className="tr-shadow">
                        <td style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <Checkbox
                                onChange={() => changeCheckbox(accType.iri)}
                                checked={checker}
                            />
                        </td>
                        <td>
                            {
                                activePage === 1 ? index + 1 : (index + 1 + itemsPerPage) + (itemsPerPage * (activePage - 2))
                            }
                        </td>
                        <td>{ accType.title }</td>
                        <td style={{fontSize: 10}}>{usersPrivileges}</td>
                        <td style={{fontSize: 10}}>{subjectsPrivileges}</td>
                        <td style={{fontSize: 10}}>{questionsPrivileges}</td>
                        <td style={{fontSize: 10}}>{notificationsPrivileges}</td>
                        <td style={{fontSize: 10}}>{levelsPrivileges}</td>
                        <td style={{fontSize: 10}}>{accountTypesPrivileges}</td>
                        <td style={{fontSize: 10}}>{userGroupsPrivileges}</td>
                        <td><Tag color="cyan">{accType.createdAtAgo}</Tag></td>
                        <td>
                            <Tooltip placement="top" title="Edit account type"><Edit onClick={() => changeEditContent(accType.id, accountTypes)} style={{cursor: "pointer"}} color="primary" /></Tooltip>
                            <Tooltip placement="top" title="Delete account type"><DeleteForeverSharpIcon onClick={()=>changeContent(accType.iri)} style={{cursor: "pointer"}} color="secondary" /></Tooltip>
                        </td>
                    </tr>
                    <tr className="spacer"></tr>
                </Fragment>
            )
        })
    }

    useEffect(() => {
        getAccountTypes();
    }, []);

    return (
        <>
            <Breadcrumb 
                pageTitle="Account Types"
                addResource={() => setOpenAddModal(true)}
            />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="title-5 m-b-35">Account Types</h3>
                        {
                            loading.content ?
                            <div className="text-center"><LoadingOutlined style={{color: 'blue'}} /></div> :
                            <div className="table-responsive">
                                <table className="table table-data2">
                                    <thead>
                                        {
                                            values.length > 0 &&
                                            <tr>
                                                <th colSpan={9}><i>{values.length} item(s) selected</i></th>
                                                <th>
                                                    {
                                                    loading.action ? 
                                                        <LoadingOutlined style={{color: 'blue'}} /> :
                                                        <Tooltip placement="top" title="Delete multiple account types">
                                                            <QuickConfirm
                                                                title="Delete All?"
                                                                color="red"
                                                                tagName="Delete"
                                                                ok={deleteAccountType}
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
                                                    indeterminate={filteredAccountTypes && values.length > 0 && values.length !== filteredAccountTypes.length}
                                                />
                                            </th>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Users Privileges</th>
                                            <th>Subjects Privileges</th>
                                            <th>Questions Privileges</th>
                                            <th>Notifications Privileges</th>
                                            <th>Levels Privileges</th>
                                            <th>Account Types Privileges</th>
                                            <th>User Groups Privileges</th>
                                            <th>Created</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableData()}
                                       
                                    </tbody>
                                </table>
                                {
                                    filteredAccountTypes && filteredAccountTypes.length > 0 &&
                                    <div style={{display: 'flex', justifyContent: 'space-between'}} className="">
                                        <p>Showing {((itemsPerPage * activePage) - itemsPerPage) + 1} to {(accountTypes.length * activePage) + ((itemsPerPage - accountTypes.length) * (activePage - 1))} of {totalAccountTypes} entries</p>
                                        {/* <Paginate
                                            activePage={activePage}
                                            itemsPerPage={itemsPerPage}
                                            totalItems={totalAccountTypes}
                                            rangeDisplay={rangeDisplay}
                                            handlePageChange={handlePageChange}
                                        /> */}
                                        <div>
                                            <Pagination count={Math.ceil(totalAccountTypes/itemsPerPage)} page={activePage} onChange={handlePageChange} color="primary" />
                                        </div>
                                    </div>
                                }
                            </div>
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
                            <Button onClick={deleteAccountType} type="primary">Delete</Button>
                            <Button onClick={() => {setOpenDeleteModal(false)}}>Cancel</Button>
                        </>
                    }
                    
                </div>
            </Modal>

            <Modal
                title={ editMode ? 'Update Account Type' : 'Add Account Type' }
                centered
                visible={openAddModal}
                onCancel={() => {setErrors(clearErrors), setOpenAddModal(false); setEditMode(false); setFormData(emptyFormData), setIdToEdit()}}
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
                <ValidationForm onSubmit={editMode ? updateAccountType : createAccountType}>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <TextInput name="title" id="title" required
                                    value={formData.title}
                                    onChange={changeFormData}
                                    errorMessage={{required:"Please enter the title of account type"}}
                                    ref={firstInput}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <TextInput name="description" id="description" multiline
                                    row={2}
                                    value={formData.description}
                                    onChange={changeFormData}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                                <label htmlFor="users">Users Previliges</label><br />
                                <Checkbox onChange={() => changeCheckboxForm('users_create')} checked={formData.usersPrivileges.create} />CREATE
                                <Checkbox onChange={() => changeCheckboxForm('users_read')} checked={formData.usersPrivileges.read} />READ
                                <Checkbox onChange={() => changeCheckboxForm('users_update')} checked={formData.usersPrivileges.update} />UPDATE
                                <Checkbox onChange={() => changeCheckboxForm('users_delete')} checked={formData.usersPrivileges.delete} />DELETE
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                                <label htmlFor="subjects">Subjects Privileges</label><br />
                                <Checkbox onChange={() => changeCheckboxForm('subjects_create')} checked={formData.subjectsPrivileges.create} />CREATE
                                <Checkbox onChange={() => changeCheckboxForm('subjects_read')} checked={formData.subjectsPrivileges.read} />READ
                                <Checkbox onChange={() => changeCheckboxForm('subjects_update')} checked={formData.subjectsPrivileges.update} />UPDATE
                                <Checkbox onChange={() => changeCheckboxForm('subjects_delete')} checked={formData.subjectsPrivileges.delete} />DELETE
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                                <label htmlFor="questions">Questions Previliges</label><br />
                                <Checkbox onChange={() => changeCheckboxForm('questions_create')} checked={formData.questionsPrivileges.create} />CREATE
                                <Checkbox onChange={() => changeCheckboxForm('questions_read')} checked={formData.questionsPrivileges.read} />READ
                                <Checkbox onChange={() => changeCheckboxForm('questions_update')} checked={formData.questionsPrivileges.update} />UPDATE
                                <Checkbox onChange={() => changeCheckboxForm('questions_delete')} checked={formData.questionsPrivileges.delete} />DELETE
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                                <label htmlFor="notifications">Notifications Previliges</label><br />
                                <Checkbox onChange={() => changeCheckboxForm('notifications_create')} checked={formData.notificationsPrivileges.create} />CREATE
                                <Checkbox onChange={() => changeCheckboxForm('notifications_read')} checked={formData.notificationsPrivileges.read} />READ
                                <Checkbox onChange={() => changeCheckboxForm('notifications_update')} checked={formData.notificationsPrivileges.update} />UPDATE
                                <Checkbox onChange={() => changeCheckboxForm('notifications_delete')} checked={formData.notificationsPrivileges.delete} />DELETE
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                                <label htmlFor="levels">Levels Previliges</label><br />
                                <Checkbox onChange={() => changeCheckboxForm('levels_create')} checked={formData.levelsPrivileges.create} />CREATE
                                <Checkbox onChange={() => changeCheckboxForm('levels_read')} checked={formData.levelsPrivileges.read} />READ
                                <Checkbox onChange={() => changeCheckboxForm('levels_update')} checked={formData.levelsPrivileges.update} />UPDATE
                                <Checkbox onChange={() => changeCheckboxForm('levels_delete')} checked={formData.levelsPrivileges.delete} />DELETE
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                                <label htmlFor="account_types">Account Types Previliges</label><br />
                                <Checkbox onChange={() => changeCheckboxForm('account_types_create')} checked={formData.accountTypesPrivileges.create} />CREATE
                                <Checkbox onChange={() => changeCheckboxForm('account_types_read')} checked={formData.accountTypesPrivileges.read} />READ
                                <Checkbox onChange={() => changeCheckboxForm('account_types_update')} checked={formData.accountTypesPrivileges.update} />UPDATE
                                <Checkbox onChange={() => changeCheckboxForm('account_types_delete')} checked={formData.accountTypesPrivileges.delete} />DELETE
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                                <label htmlFor="account_types">User Groups Previliges</label><br />
                                <Checkbox onChange={() => changeCheckboxForm('user_groups_create')} checked={formData.userGroupsPrivileges.create} />CREATE
                                <Checkbox onChange={() => changeCheckboxForm('user_groups_read')} checked={formData.userGroupsPrivileges.read} />READ
                                <Checkbox onChange={() => changeCheckboxForm('user_groups_update')} checked={formData.userGroupsPrivileges.update} />UPDATE
                                <Checkbox onChange={() => changeCheckboxForm('user_groups_delete')} checked={formData.userGroupsPrivileges.delete} />DELETE
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



export default AccountTypes;