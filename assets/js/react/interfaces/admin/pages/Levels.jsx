import React, { useEffect, useCallback, useState, levelef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Select, Button, Modal, Alert, Checkbox, Tag, Popconfirm, Popover, Upload, message, Tooltip, Input } from 'antd';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import BluetoothSearchingIcon from '@material-ui/icons/BluetoothSearching';
import Edit from '@material-ui/icons/Edit';
import { LoadingOutlined } from '@ant-design/icons';
import { ValidationForm, TextInput, SelectGroup } from 'react-bootstrap4-form-validation';
import Pagination from '@material-ui/lab/Pagination';

import * as LevelsActions from '../../../store/actions/levels';
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

const Levels = () => {

    const width = useWindowWidth();

    const levels = useSelector(state => state.levels.data);
    const [filteredLevels, setFilteredLevels] = useState(levels);
    const totalLevels = useSelector(state => state.levels.count);
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
        getlevels(pageNumber);
        setActivePage(pageNumber);
    }, [getLevels, setActivePage]);

    //  Datatable
    const changeCheckbox = useCallback((id) => {
        let arr = [];
        if(id === 0){
            if(filteredLevels.length === 0){return;}
            if(values.length !== filteredLevels.length){
                filteredLevels.map(x => arr.push(x.iri));
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
        arr.length === filteredLevels.length ? setGlobal(true) : setGlobal(false);
    }, [filteredLevels, values, setValues, global, setGlobal]);

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
        getSingleLevel(val, data);
        setIdToEdit(val);
        setOpenAddModal(true);
    }, [setEditMode, getSingleLevel, setIdToDelete, setOpenDeleteModal]);

    const changeContent = useCallback((val) => {
        setValues([val]);
        setIdToDelete(val);
        setOpenDeleteModal(true);
    }, [setIdToDelete, setValues, setOpenDeleteModal]);

    const getSingleLevel = useCallback((val, data) => {
        let level = data.find(level => level.id === val);

        setFormData({
            ...formData,
            title: level.title,
            description: level.description
        });
       
    }, [formData, setFormData]);

    const deleteLevel = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });

        try {
            await dispatch(LevelsActions.destroy(values));

            setOpenDeleteModal(false);
            values.length > 1 ? Message('success', 'Levels were deleted successfully', 5) : Message('success', 'Level was deleted successfully', 5);
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

    const updateLevel = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);

        try {
            await dispatch(LevelsActions.update(idToEdit, formData));
            Message('success', 'level was updated successfully', 5);
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

    const createLevel = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);

        try {
            await dispatch(LevelsActions.create(formData));
            Message('success', 'level was created successfully', 5);
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

    const getLevels = useCallback(async (page = 1) => {
        setLoading({
            ...loading,
            content: true
        });

        try {
            await dispatch(LevelsActions.read(page));
        } catch(error) {
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

        levels.map((levelObj) => {
            Object.keys(levelObj).map(key => {
                let single = levelObj[key];
                let singleUpper = String(single).toUpperCase();
                let inputValUpper = String(inputVal).toUpperCase();

                if(singleUpper.indexOf(inputValUpper) !== -1){
                    newFilterMe.indexOf(levelObj) == -1 ? newFilterMe.push(levelObj) : null;
                }
            });
        });
        setFilteredLevels(newFilterMe);
    }, [setValues, setGlobal, setFilterMe, levels, setFilteredLevels]);
    
    const renderTableData = () => {
        if (!filteredLevels){
            return <tr className="text-center"><td colSpan={6}><Spin /></td></tr>
        }
        if(filteredLevels.length === 0){
            return <tr className="text-center"><td colSpan={6}><strong><i>No record found!</i></strong></td></tr>
        }
        return filteredLevels.map((level, index) => {
            let checker = isChecked(level.iri);
            return (
                <React.Fragment key={index}>
                    <tr className="tr-shadow">
                        <td>
                            <Checkbox
                                onChange={() => changeCheckbox(level.iri)}
                                checked={checker}
                            />
                        </td>
                        <td>
                            {
                                activePage === 1 ? index + 1 : (index + 1 + itemsPerPage) + (itemsPerPage * (activePage - 2))
                            }
                        </td>
                        <td>{level.title}</td>
                        <td>{level.description}</td>
                        <td><Tag color="cyan">{level.createdAtAgo}</Tag></td>
                        <td>
                            <Tooltip placement="top" title="Edit level"><Edit onClick={() => changeEditContent(level.id, levels)} style={{cursor: "pointer"}} color="primary" /></Tooltip>
                            <Tooltip placement="top" title="Delete level"><DeleteForeverSharpIcon onClick={()=>changeContent(level.iri)} style={{cursor: "pointer"}} color="secondary" /></Tooltip>
                        </td>
                    </tr>
                    <tr className="spacer"></tr>
                </React.Fragment>
            )
        })
    }

    useEffect(() => {
        getLevels();
    }, []);

    useEffect(() => {
        setFilteredLevels(levels);
    }, [levels]);

    return (
        <>
            <Breadcrumb 
                pageTitle="levels"
                addResource={() => setOpenAddModal(true)}
            />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="title-5 m-b-35">Levels</h3>
                        {
                            loading.content ?
                            <div className="text-center"><LoadingOutlined style={{color: 'blue'}} /></div> :
                            <>
                                <div className="col-lg-3 col-md-4">
                                    <Input placeholder="Search level..." allowClear value={filterMe} onChange={changeFilteredMe} />
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
                                                                    ok={deleteLevel}
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
                                                        indeterminate={filteredLevels && values.length > 0 && values.length !== filteredLevels.length}
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
                                        filteredLevels && filteredLevels.length > 0 &&
                                        <div style={{display: 'flex', justifyContent: 'space-between'}} className="">
                                            <p>Showing {((itemsPerPage * activePage) - itemsPerPage) + 1} to {(levels.length * activePage) + ((itemsPerPage - levels.length) * (activePage - 1))} of {totalLevels} entries</p>
                                            {/* <Paginate
                                                activePage={activePage}
                                                itemsPerPage={itemsPerPage}
                                                totalItems={totalLevels}
                                                rangeDisplay={rangeDisplay}
                                                handlePageChange={handlePageChange}
                                            /> */}
                                             <div>
                                                <Pagination count={Math.ceil(totalLevels/itemsPerPage)} page={activePage} onChange={handlePageChange} color="primary" />
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
                            <Button onClick={deleteLevel} type="primary">Delete</Button>
                            <Button onClick={() => {setOpenDeleteModal(false)}}>Cancel</Button>
                        </>
                    }
                    
                </div>
            </Modal>
            
            <Modal
                title={ editMode ? 'Update level' : 'Add level' }
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
                <ValidationForm onSubmit={editMode ? updateLevel : createLevel}>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="title">Name of level</label>
                                <TextInput name="title" id="title" required
                                    value={formData.title}
                                    onChange={changeFormData}
                                    errorMessage={{required:"Please enter the name of level"}}
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
                
                    <div className="form-group float-right">
                        <button disabled={loading.action} className="btn btn-login">{ loading.action ? <><span>Saving</span> <Spin /></> : editMode ? 'Update' : "Save" }</button>
                    </div>
                </ValidationForm><br /><br />
            </Modal>
        </>
    )
}



export default Levels;