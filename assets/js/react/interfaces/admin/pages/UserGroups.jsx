import React, { useEffect, useCallback, useState, userGroupef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Select, Button, Modal, Alert, Checkbox, Tag, Popconfirm, Popover, Upload, message, Tooltip, Input } from 'antd';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import BluetoothSearchingIcon from '@material-ui/icons/BluetoothSearching';
import Edit from '@material-ui/icons/Edit';
import { LoadingOutlined } from '@ant-design/icons';
import { ValidationForm, TextInput, SelectGroup } from 'react-bootstrap4-form-validation';
import Pagination from '@material-ui/lab/Pagination';

import * as UserGroupsActions from '../../../store/actions/user-groups';
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
    cost: 0,
    daysValidity: 0
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

const UserGroups = () => {

    const width = useWindowWidth();

    const userGroups = useSelector(state => state.userGroups.data);
    const [filteredUserGroups, setFilteredUserGroups] = useState(userGroups);
    const totalUserGroups = useSelector(state => state.userGroups.count);
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
        getUserGroups(pageNumber);
        setActivePage(pageNumber);
    }, [getUserGroups, setActivePage]);

    //  Datatable
    const changeCheckbox = useCallback((id) => {
        let arr = [];
        if(id === 0){
            if(filteredUserGroups.length === 0){return;}
            if(values.length !== filteredUserGroups.length){
                filteredUserGroups.map(x => arr.push(x.iri));
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
        arr.length === filteredUserGroups.length ? setGlobal(true) : setGlobal(false);
    }, [filteredUserGroups, values, setValues, global, setGlobal]);

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
        getSingleUserGroup(val, data);
        setIdToEdit(val);
        setOpenAddModal(true);
    }, [setEditMode, getSingleUserGroup, setIdToDelete, setOpenDeleteModal]);

    const changeContent = useCallback((val) => {
        setValues([val]);
        setIdToDelete(val);
        setOpenDeleteModal(true);
    }, [setIdToDelete, setValues, setOpenDeleteModal]);

    const getSingleUserGroup = useCallback((val, data) => {
        let userGroup = data.find(userGrp => userGrp.id === val);

        setFormData({
            ...formData,
            title: userGroup.title,
            description: userGroup.description
        });
       
    }, [formData, setFormData]);

    const activateUserGroup = useCallback(async (userGroup, value) => {

        setLoading({
            ...loading,
            content: true
        });
        try {
            await dispatch(UserGroupsActions.activate(userGroup, value));

            Message('success', value === 'activate' ? 'User group was activated successfully' : 'userGroup was blocked successfully', 10);
            setValues([]);
            setGlobal(false);
        }catch(error){
            Message('error', 'There was an error activating user group', 10);
        }
        setLoading({
            ...loading, 
            content: false
        });
    }, [setLoading, loading, dispatch, setValues, setGlobal]);

    const deleteUserGroup = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });

        try {
            await dispatch(UserGroupsActions.destroy(values));

            setOpenDeleteModal(false);
            values.length > 1 ? Message('success', 'User groups were deleted successfully', 5) : Message('success', 'User group was deleted successfully', 5);
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

    const updateUserGroup = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);

        try {
            await dispatch(UserGroupsActions.update(idToEdit, formData));
            Message('success', 'User group was updated successfully', 5);
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

    const createUserGroup = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);

        try {
            await dispatch(UserGroupsActions.create(formData));
            Message('success', 'User group was created successfully', 5);
            setFormData(emptyFormData);
            setImgUrl();
        }catch (error){
            console.log(error.response);
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

    const getUserGroups = useCallback(async (page = 1) => {
        setLoading({
            ...loading,
            content: true
        });

        try {
            await dispatch(UserGroupsActions.read(page));
        } catch(error) {
            console.log(error.response);
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
            setErrors(clearErrors);
        }
        setLoading({
            ...loading,
            content: false
        });
    }, [dispatch, setLoading, loading, setErrors, Notification]);

    const changeFilteredMe = useCallback((e) => {
        setValues([]); setGlobal(false);
        let inputVal = e.target.value;
        setFilterMe(inputVal);
        let newFilterMe = []; // Store filter objects based on inputed fields

        userGroups.map((userGrpObj) => {
            Object.keys(userGrpObj).map(key => {
                let single = userGrpObj[key];
                let singleUpper = String(single).toUpperCase();
                let inputValUpper = String(inputVal).toUpperCase();

                if(singleUpper.indexOf(inputValUpper) !== -1){
                    newFilterMe.indexOf(userGrpObj) == -1 ? newFilterMe.push(userGrpObj) : null;
                }
            });
        });
        setFilteredUserGroups(newFilterMe);
    }, [setValues, setGlobal, setFilterMe, userGroups, setFilteredUserGroups]);
    
    const renderTableData = () => {
        if (!filteredUserGroups){
            return <tr className="text-center"><td colSpan={9}><Spin /></td></tr>
        }
        if(filteredUserGroups.length === 0){
            return <tr className="text-center"><td colSpan={9}><strong><i>No record found!</i></strong></td></tr>
        }
        return filteredUserGroups.map((userGrp, index) => {
            let checker = isChecked(userGrp.iri);
            return (
                <React.Fragment key={index}>
                    <tr className="tr-shadow">
                        <td>
                            <Checkbox
                                onChange={() => changeCheckbox(userGrp.iri)}
                                checked={checker}
                            />
                        </td>
                        <td>
                            {
                                activePage === 1 ? index + 1 : (index + 1 + itemsPerPage) + (itemsPerPage * (activePage - 2))
                            }
                        </td>
                        <td>{userGrp.title}</td>
                        <td>{userGrp.description}</td>
                        <td>{userGrp.cost}</td>
                        <td>{userGrp.daysValidity}</td>
                        <td><Tag color="cyan">{userGrp.createdAtAgo}</Tag></td>
                        <td>
                            {
                                !userGrp.status ? 
                                    <Tooltip placement="top" title="Activate user group?">
                                        <QuickConfirm
                                            title="Activate user group?"
                                            color="red"
                                            tagName="Blocked"
                                            ok={() => activateUserGroup(userGrp.id, 'activate')}
                                        />
                                    </Tooltip>
                                :
                                <Tooltip placement="top" title="Block user group?">
                                <QuickConfirm
                                    title="Block user group?"
                                    color="green"
                                    tagName="Active"
                                    ok={() => activateUserGroup(userGrp.id, 'block')}
                                />
                            </Tooltip>
                            //  <Tag color="green">Active</Tag>
                            }
                            
                        </td>
                        <td>
                            <Tooltip placement="top" title="Edit userGroup"><Edit onClick={() => changeEditContent(userGrp.id, userGroups)} style={{cursor: "pointer"}} color="primary" /></Tooltip>
                            <Tooltip placement="top" title="Delete userGroup"><DeleteForeverSharpIcon onClick={()=>changeContent(userGrp.iri)} style={{cursor: "pointer"}} color="secondary" /></Tooltip>
                        </td>
                    </tr>
                    <tr className="spacer"></tr>
                </React.Fragment>
            )
        })
    }

    useEffect(() => {
        getUserGroups();
    }, []);

    useEffect(() => {
        setFilteredUserGroups(userGroups);
    }, [userGroups]);

    return (
        <>
            <Breadcrumb 
                pageTitle="User Groups"
                addResource={() => setOpenAddModal(true)}
            />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="title-5 m-b-35">User Groups</h3>
                        {
                            loading.content ?
                            <div className="text-center"><LoadingOutlined style={{color: 'blue'}} /></div> :
                            <>
                                <div className="col-lg-3 col-md-4">
                                    <Input placeholder="Search user group..." allowClear value={filterMe} onChange={changeFilteredMe} />
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
                                                                    ok={deleteUserGroup}
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
                                                        indeterminate={filteredUserGroups && values.length > 0 && values.length !== filteredUserGroups.length}
                                                    />
                                                </th>
                                                <th>#</th>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>Cost</th>
                                                <th>Days Validity <br />(0 = Unlimited)</th>
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
                                        filteredUserGroups && filteredUserGroups.length > 0 &&
                                        <div style={{display: 'flex', justifyContent: 'space-between'}} className="">
                                            <p>Showing {((itemsPerPage * activePage) - itemsPerPage) + 1} to {(userGroups.length * activePage) + ((itemsPerPage - userGroups.length) * (activePage - 1))} of {totalUserGroups} entries</p>
                                            {/* <Paginate
                                                activePage={activePage}
                                                itemsPerPage={itemsPerPage}
                                                totalItems={totalUserGroups}
                                                rangeDisplay={rangeDisplay}
                                                handlePageChange={handlePageChange}
                                            /> */}
                                            <div>
                                                <Pagination count={Math.ceil(totalUserGroups/itemsPerPage)} page={activePage} onChange={handlePageChange} color="primary" />
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
                            <Button onClick={deleteUserGroup} type="primary">Delete</Button>
                            <Button onClick={() => {setOpenDeleteModal(false)}}>Cancel</Button>
                        </>
                    }
                    
                </div>
            </Modal>
            
            <Modal
                title={ editMode ? 'Update userGroup' : 'Add userGroup' }
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
                <ValidationForm onSubmit={editMode ? updateUserGroup : createUserGroup}>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="title">Name of User Group</label>
                                <TextInput name="title" id="title" required
                                    value={formData.title}
                                    onChange={changeFormData}
                                    errorMessage={{required:"Please enter the name of user group"}}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <TextInput name="description" id="description" multiline
                                    row={4}
                                    value={formData.description}
                                    onChange={changeFormData}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="cost">Cost</label>
                                <TextInput name="cost" id="cost"
                                    type="number"
                                    value={formData.cost}
                                    onChange={changeFormData}
                                    min={0}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="daysValidity">No of days validity</label>
                                <TextInput name="daysValidity" id="daysValidity"
                                    value={formData.daysValidity}
                                    onChange={changeFormData}
                                    min={0}
                                />
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



export default UserGroups;