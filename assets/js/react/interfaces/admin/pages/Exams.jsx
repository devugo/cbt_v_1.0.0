import React, { useEffect, useCallback, useState, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Select, Button, Modal, Alert, Checkbox, Tag, Badge, message, Tooltip, Input, Radio, TimePicker } from 'antd';
import moment from 'moment';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import BluetoothSearchingIcon from '@material-ui/icons/BluetoothSearching';
import Edit from '@material-ui/icons/Edit';
import { LoadingOutlined } from '@ant-design/icons';
import { ValidationForm, TextInput, SelectGroup } from 'react-bootstrap4-form-validation';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import * as ExamsActions from '../../../store/actions/exams';
import * as ExamTypesActions from '../../../store/actions/exam-types';
import * as UserGroupsActions from '../../../store/actions/user-groups';
import * as LevelsActions from '../../../store/actions/levels';
import * as SubjectsActions from '../../../store/actions/subjects';
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
    startFrom: '',
    endAfter: '',
    duration: '30',
    maximumAttempts: '1',
    percentagePassMark: '50',
    correctAnswerScore: '1',
    wrongAnswerScore: '0',
    allowedIpAddresses: '',
    viewAnswersAfterSubmitting: false,
    openQuiz: false,
    showResultPosition: false,
    addQuestions: false,
    price: '0',
    generateCertificate: false,
    certificateText: '',
    userGroup: '',
    examType: '',
    startTime: '00:00',
    endTime: '00:00',
    level: '',
    subject: '',
    noOfQuestions: '1',
    shuffleQuestions: false,
    shuffleOptions: false
};

const emptySortData = {
    userGroup: ''
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

const format = 'HH:mm';

const Exams = () => {

    const classes = useStyles();
    const fileInp = useRef(null);
    const width = useWindowWidth();

    const exams = useSelector(state => state.exams.data);
    const [filteredExams, setFilteredExams] = useState(exams);
    const totalExams = useSelector(state => state.exams.count);
    const examTypes = useSelector(state => state.examTypes.data);
    const userGroups = useSelector(state => state.userGroups.data);
    const subjects = useSelector(state => state.subjects.data);
    const levels = useSelector(state => state.levels.data);
    const dispatch = useDispatch();
    
    // Datatable states
    const [values, setValues] = useState([]);
    const [global, setGlobal] = useState(false);

    const [errors, setErrors] = useState(clearErrors);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openGenerateQuestionModal, setOpenGenerateQuestionModal] = useState(false);
    const [examToGenerateQuestions, setExamToGenerateQuestions] = useState();

    const [formData, setFormData] = useState(emptyFormData);
    const [sortData, setSortData] = useState(emptySortData);
    const [loading, setLoading] = useState(loaders);
    const [imgUrl, setImgUrl] = useState();
    const [filterMe, setFilterMe] = useState("");
    const [activePage, setActivePage] = useState(1);

    const [editMode, setEditMode] = useState(false);
    const [idToEdit, setIdToEdit] = useState();

    const [idToDelete, setIdToDelete] = useState();

    //  Pagination
    const handlePageChange = useCallback((event, pageNumber) => {
        getExams(pageNumber);
        setActivePage(pageNumber);
    }, [getExams, setActivePage]);

    //  Datatable
    const changeCheckbox = useCallback((id) => {
        let arr = [];
        if(id === 0){
            if(filteredExams.length === 0){return;}
            if(values.length !== filteredExams.length){
                filteredExams.map(x => arr.push(x.iri));
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
        arr.length === filteredExams.length ? setGlobal(true) : setGlobal(false);
    }, [filteredExams, values, setValues, global, setGlobal]);

    const isChecked = useCallback((val) => {
        // return values.indexOf(val);
        return values.some(x => x === val);
    }, [values]);

    // Close errors to clear errors
    const onClose = useCallback(() => {
        setErrors(clearErrors);
    }, [setErrors]);

    const changeStartTime = useCallback((time, timeString) => {
        setFormData({
            ...formData,
            startTime: timeString
        });
    }, [setFormData, formData]);

    const changeEndTime = useCallback((time, timeString) => {
        setFormData({
            ...formData,
            endTime: timeString
        });
    }, [setFormData, formData]);

    const onChangeSortUserGroup = useCallback((value) => {
        setSortData({
            ...sortData,
            userGroup: value
        });
    }, [sortData, setSortData]);

    const changeFormData = useCallback((e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
    }, [formData, setFormData]);

    const changeGenerateContent = useCallback((val) => {
        setExamToGenerateQuestions(val);
        setOpenGenerateQuestionModal(true);
    }, [setExamToGenerateQuestions, setOpenGenerateQuestionModal]);

    const changeEditContent = useCallback((val, data) => {
        setEditMode(true);
        getSingleExam(val, data);
        setIdToEdit(val);
        setOpenAddModal(true);
    }, [setEditMode, getSingleExam, setIdToDelete, setOpenDeleteModal]);

    const changeContent = useCallback((val) => {
        setValues([val]);
        setIdToDelete(val);
        setOpenDeleteModal(true);
    }, [setIdToDelete, setValues, setOpenDeleteModal]);

    const getSingleExam = useCallback((val, data) => {
        let exam = data.find(exam => exam.id === val);

        setFormData({
            ...formData,
            title: exam.title,
            description: exam.description,
            startFrom: exam.startFrom,
            endAfter: exam.endAfter,
            duration: exam.duration,
            maximumAttempts: exam.maximumAttempts,
            percentagePassMark: exam.percentagePassMark,
            correctAnswerScore: exam.correctAnswerScore,
            wrongAnswerScore: exam.wrongAnswerScore,
            allowedIpAddresses: exam.allowedIpAddresses,
            viewAnswersAfterSubmitting: exam.viewAnswersAfterSubmitting,
            openQuiz: exam.openQuiz,
            showResultPosition: exam.showResultPosition,
            addQuestions: exam.addQuestions,
            price: exam.price,
            generateCertificate: exam.generateCertificate,
            certificateText: exam.certificateText,
            userGroup: exam.userGroup,
            examType: exam.examType,
            startTime: exam.startTime,
            endTime: exam.endTime,
            shuffleQuestions: exam.shuffleQuestions,
            shuffleOptions: exam.shuffleQuestions
        });
       
    }, [exams, formData, setFormData]);

    const generateQuestions = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        
        setErrors(clearErrors);

        try {
            await dispatch(ExamsActions.generateQuestions(formData, examToGenerateQuestions));

            setOpenGenerateQuestionModal(false);
            Message('success', 'Questions were generated successfully', 5);
            setExamToGenerateQuestions();
            setFormData(emptyFormData);
        }catch(error){
            if(error.response.data && error.response.data.errors){
                let serverErrors = JSON.parse(error.response.data.errors);
                if(serverErrors){
                    serverErrorDesc = serverErrors;
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
    }, [dispatch, examToGenerateQuestions, formData, setOpenGenerateQuestionModal, setExamToGenerateQuestions, setLoading, loading, setErrors, errors]);

    const activateExam = useCallback(async (exam, value) => {

        setLoading({
            ...loading,
            content: true
        });
        try {
            await dispatch(ExamsActions.activate(exam, value));

            Message('success', value === 'activate' ? 'Exam was activated successfully' : 'Exam was blocked successfully', 10);
            setValues([]);
            setGlobal(false);
        }catch(error){
            Message('error', 'There was an error activating exam', 10);
        }
        setLoading({
            ...loading, 
            content: false
        });
    }, [setLoading, loading, dispatch, setValues, setGlobal]);

    const deleteExam = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });

        try {
            await dispatch(ExamsActions.destroy(values));

            setOpenDeleteModal(false);
            values.length > 1 ? Message('success', 'exams were deleted successfully', 5) : Message('success', 'exam was deleted successfully', 5);
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

    const updateExam = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);

        try {
            await dispatch(ExamsActions.update(idToEdit, formData));
            Message('success', 'Exam was updated successfully', 5);
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

    const createExam = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);

        try {
            await dispatch(ExamsActions.create(formData));
            Message('success', 'Exam was created successfully', 5);
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

    const getExams = useCallback(async (page = 1, pagination = true, userGroup = sortData.userGroup) => {
        // setFilteredexams(); setexams(); 
        setLoading({
            ...loading,
            content: true
        });

        try {
            await dispatch(ExamsActions.read(page, pagination, userGroup));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
            setErrors(clearErrors);
        }
        setLoading({
            ...loading,
            content: false
        });
    }, [dispatch, setLoading, loading, setErrors, Notification, sortData]);

    const getExamTypes = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(ExamTypesActions.read(page, pagination));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);

    const getUserGroups = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(UserGroupsActions.read(page, pagination));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);
    
    const getLevels = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(LevelsActions.read(page, pagination));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);

    const getSubjects = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(SubjectsActions.read(page, pagination));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);

    const changeFilteredMe = useCallback((e) => {
        setValues([]); setGlobal(false);
        let inputVal = e.target.value;
        setFilterMe(inputVal);
        let newFilterMe = []; // Store filter objects based on inputed fields

        exams.map((examObj) => {
            Object.keys(examObj).map(key => {
                let single = examObj[key];
                let singleUpper = String(single).toUpperCase();
                let inputValUpper = String(inputVal).toUpperCase();

                if(singleUpper.indexOf(inputValUpper) !== -1){
                    newFilterMe.indexOf(examObj) == -1 ? newFilterMe.push(examObj) : null;
                }
            });
        });
        setFilteredExams(newFilterMe);
    }, [setValues, setGlobal, setFilterMe, exams, setFilteredExams]);
    
    const renderTableData = () => {
        if (!filteredExams){
            return <tr className="text-center"><td colSpan={8}><Spin /></td></tr>
        }
        if(filteredExams.length === 0){
            return <tr className="text-center"><td colSpan={8}><strong><i>No record found!</i></strong></td></tr>
        }
        return filteredExams.map((exam, index) => {
            let checker = isChecked(exam.iri);
            return (
                <React.Fragment key={index}>
                    <tr className="tr-shadow">
                        <td style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <Checkbox
                                onChange={() => changeCheckbox(exam.iri)}
                                checked={checker}
                            />
                        </td>
                        <td>
                            {
                                activePage === 1 ? index + 1 : (index + 1 + itemsPerPage) + (itemsPerPage * (activePage - 2))
                            }
                        </td>
                        <td>{exam.title}</td>
                        <td>{exam.description}</td>
                        <td>{userGroups && userGroups.length > 0 && (userGroups.find(grp => grp.iri === exam.userGroup)).title}</td>
                        <td className="text-center"><Badge count={exam.questions} style={{backgroundColor: 'dodgerBlue', fontWeight: 'bold'}} /></td>
                        <td><Tag color="cyan">{exam.createdAtAgo}</Tag></td>
                        <td>
                            {
                                !exam.status ? 
                                    <Tooltip placement="top" title="Activate exam?">
                                        <QuickConfirm
                                            title="Activate exam?"
                                            color="red"
                                            tagName="Blocked"
                                            ok={() => activateExam(exam.id, 'activate')}
                                        />
                                    </Tooltip>
                                :
                                <Tooltip placement="top" title="Block exam?">
                                <QuickConfirm
                                    title="Block exam?"
                                    color="green"
                                    tagName="Active"
                                    ok={() => activateExam(exam.id, 'block')}
                                />
                            </Tooltip>
                            //  <Tag color="green">Active</Tag>
                            }
                            
                        </td>
                        <td>
                            {
                                exam.addQuestions && <Tooltip placement="top" title="Generate Questions"><BluetoothSearchingIcon onClick={()=>changeGenerateContent(exam.id)} style={{cursor: "pointer", color: "orange"}} /></Tooltip>
                            }
                            <Tooltip placement="top" title="Edit exam"><Edit onClick={() => changeEditContent(exam.id, exams)} style={{cursor: "pointer"}} color="primary" /></Tooltip>
                            <Tooltip placement="top" title="Delete exam"><DeleteForeverSharpIcon onClick={()=>changeContent(exam.iri)} style={{cursor: "pointer"}} color="secondary" /></Tooltip>
                        </td>
                    </tr>
                    <tr className="spacer"></tr>
                </React.Fragment>
            )
        })
    }

    useEffect(() => {
        getExamTypes();
        getUserGroups();
        getLevels();
        getSubjects();
    }, []);

    useEffect(() => {
        getExams();
    }, [sortData]);

    useEffect(() => {
        setFilteredExams(exams);
    }, [exams]);

    return (
        <>
            <Breadcrumb 
                pageTitle="Exams"
                addResource={() => setOpenAddModal(true)}
            />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="title-5 m-b-35">Exams</h3>
                        {
                            loading.content ?
                            <div className="text-center"><LoadingOutlined style={{color: 'blue', fontSize: 50}} /></div> :
                            <>
                                <div className="row">
                                    <div className="col-lg-1 col-md-1">
                                        Filter: 
                                    </div>
                                    <div className="col-lg-8 col-md-8">
                                        <div style={{width: '100%', display: 'flex'}}>
                                            <div style={{width: '33%'}}>
                                                <Select
                                                    showSearch
                                                    style={{width: 200}}
                                                    placeholder="Filter by group"
                                                    optionFilterProp="children"
                                                    onChange={onChangeSortUserGroup}
                                                    value={sortData.userGroup}
                                                >
                                                    <Select.Option value="">All Groups</Select.Option>
                                                    {
                                                        userGroups && userGroups.length > 0 && userGroups.map((userGrp, index) => <Select.Option key={index} value={userGrp.iri}>{userGrp.title}</Select.Option>)
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div><br />
                                <div className="row">
                                    <div className="col-lg-3 col-md-4">
                                        <Input placeholder="Search exam..." allowClear value={filterMe} onChange={changeFilteredMe} />
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
                                                                    ok={deleteExam}
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
                                                        indeterminate={filteredExams && values.length > 0 && values.length !== filteredExams.length}
                                                    />
                                                </th>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Group</th>
                                                <th>Questions Added</th>
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
                                        filteredExams && filteredExams.length > 0 &&
                                        <div style={{display: 'flex', justifyContent: 'space-between'}} className="">
                                            <p>Showing {((itemsPerPage * activePage) - itemsPerPage) + 1} to {(exams.length * activePage) + ((itemsPerPage - exams.length) * (activePage - 1))} of {totalExams} entries</p>
                                            {/* <Paginate
                                                activePage={activePage}
                                                itemsPerPage={itemsPerPage}
                                                totalItems={totalexams}
                                                rangeDisplay={rangeDisplay}
                                                handlePageChange={handlePageChange}
                                            /> */}
                                            <div className={classes.root}>
                                                <Pagination count={Math.ceil(totalExams/itemsPerPage)} page={activePage} onChange={handlePageChange} color="primary" />
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
                            <Button onClick={deleteExam} type="primary">Delete</Button>
                            <Button onClick={() => {setOpenDeleteModal(false)}}>Cancel</Button>
                        </>
                    }
                    
                </div>
            </Modal>

            <Modal
                title={exams && examToGenerateQuestions && `Generate Questions for (${exams.find(exm => exm.id === examToGenerateQuestions).title}) exam`}
                centered
                visible={openGenerateQuestionModal}
                onCancel={() => {setOpenGenerateQuestionModal(false); setExamToGenerateQuestions(); setFormData(emptyFormData)}}
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
                <ValidationForm onSubmit={generateQuestions}>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="subject">Select Subject</label>
                                <SelectGroup name="subject" id="subject"
                                    value={formData.subject}
                                    required
                                    errorMessage="Please a select a subject"
                                    onChange={changeFormData}
                                >
                                    <option value="">--- Please select ---</option>
                                    {
                                        subjects.map((subject, index) => <option key={index} value={subject.iri}>{subject.title}</option>)
                                    }
                                </SelectGroup>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="level">Select Level</label>
                                <SelectGroup name="level" id="level"
                                    value={formData.level}
                                    required
                                    errorMessage="Please a select a level"
                                    onChange={changeFormData}
                                >
                                    <option value="">--- Please select ---</option>
                                    {
                                        levels.map((level, index) => <option key={index} value={level.iri}>{level.title}</option>)
                                    }
                                </SelectGroup>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="noOfQuestions">No of Questions</label>
                                <TextInput name="noOfQuestions" id="title" required
                                    type="number"
                                    min={1}
                                    value={formData.noOfQuestions}
                                    onChange={changeFormData}
                                    errorMessage={{required:"Please enter the number of questions to generate for exam"}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group float-right">
                        <button disabled={loading.action} className="btn btn-login">{ loading.action ? <><span>Generating</span> <Spin /></> : 'Generate' }</button>
                    </div>
                </ValidationForm><br /><br />
            </Modal>
            
            <Modal
                title={ editMode ? 'Update exam' : 'Add exam' }
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
                <ValidationForm onSubmit={editMode ? updateExam : createExam}>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="title">Name of Exam</label>
                                <TextInput name="title" id="title" required
                                    value={formData.title}
                                    onChange={changeFormData}
                                    errorMessage={{required:"Please enter the name of exam"}}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <TextInput name="description" id="description"
                                    value={formData.description}
                                    onChange={changeFormData}
                                />
                            </div>
                        </div>
                    </div><hr />
                    <div className="row">
                        <div className="col-lg-offset-3 col-md-offset-3 col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="examType">Exam Type</label>
                                <SelectGroup name="examType" id="examType"
                                    value={formData.examType}
                                    required
                                    errorMessage="Please a select an exam type"
                                    onChange={changeFormData}
                                >
                                    <option value="">--- Please select ---</option>
                                    {
                                        examTypes.map((examType, index) => <option key={index} value={examType.iri}>{examType.title}</option>)
                                    }
                                </SelectGroup>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {
                            formData.examType === '/api/exam_types/3' &&
                            <>
                                <div className="col-lg-3 col-md-3">
                                    <label htmlFor="startTime">Start Time</label><br />
                                    <TimePicker onChange={changeStartTime} defaultValue={moment(formData.startTime, 'HH:mm')} /*defaultValue={moment('12:08', format)}*/ format={format} />
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <label htmlFor="endTime">End Time</label><br />
                                    <TimePicker onChange={changeEndTime} defaultValue={moment(formData.endTime, 'HH:mm')} /*defaultValue={moment('12:08', format)}*/ format={format} />
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="startFrom">Exam Date</label>
                                        <TextInput name="startFrom" id="startFrom"
                                            type="date"
                                            value={formData.startFrom}
                                            required
                                            errorMessage="Please enter an exam start date"
                                            onChange={changeFormData}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                        {
                            formData.examType === '/api/exam_types/2' &&
                            <>
                                 <div className="col-lg-3 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="startFrom">Exam Start Date</label>
                                        <TextInput name="startFrom" id="startFrom"
                                            type="date"
                                            value={formData.startFrom}
                                            required
                                            errorMessage="Please enter an exam start date"
                                            onChange={changeFormData}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="endAfter">Exam End Date</label>
                                        <TextInput name="endAfter" id="endAfter"
                                            type="date"
                                            value={formData.endAfter}
                                            required
                                            errorMessage="Please enter an exam end date"
                                            onChange={changeFormData}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="duration">Duration (in minutes)</label>
                                        <TextInput name="duration" id="duration"
                                            value={formData.duration}
                                            min={5}
                                            type="number"
                                            required
                                            errorMessage="Please enter an exam duration"
                                            onChange={changeFormData}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                        {
                            formData.examType === '/api/exam_types/1' &&
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="duration">Duration (in minutes)</label>
                                    <TextInput name="duration" id="duration"
                                        value={formData.duration}
                                        min={5}
                                        type="number"
                                        required
                                        errorMessage="Please enter an exam duration"
                                        onChange={changeFormData}
                                    />
                                </div>
                            </div>
                        }
                       
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor="userGroup">User Group</label>
                                <SelectGroup name="userGroup" id="userGRoup"
                                    value={formData.userGroup}
                                    required
                                    errorMessage="Please a select a user group"
                                    onChange={changeFormData}
                                >
                                    <option value="">--- Please select ---</option>
                                    {
                                        userGroups.map((userGroup, index) => <option key={index} value={userGroup.iri}>{userGroup.title}</option>)
                                    }
                                </SelectGroup>
                            </div>
                        </div>
                    </div>
                        <>
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="allowedIpAddresses">Allowed IP addresses</label>
                                        <TextInput name="allowedIpAddresses" id="allowedIpAddresses"
                                            value={formData.allowedIpAddresses}
                                            onChange={changeFormData}
                                        />
                                        <small>Leave empty to allow access to all IPs</small>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="maximumAttempts">Exam Maximum Attempts</label>
                                        <TextInput name="maximumAttempts" id="maximumAttempts"
                                            type="number"
                                            min={1}
                                            value={formData.maximumAttempts}
                                            required
                                            errorMessage="Please enter an exam maximum attempts"
                                            onChange={changeFormData}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="percentagePassMark">Percentage Pass Mark</label>
                                        <TextInput name="percentagePassMark" id="percentagePassMark"
                                            type="number"
                                            min={1}
                                            value={formData.percentagePassMark}
                                            required
                                            errorMessage="Please enter the percentage pass mark"
                                            onChange={changeFormData}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="correctAnswerScore">Correct Answer Score</label>
                                        <TextInput name="correctAnswerScore" id="correctAnswerScore"
                                            type="number"
                                            min={1}
                                            value={formData.correctAnswerScore}
                                            required
                                            errorMessage="Please enter correct answer score"
                                            onChange={changeFormData}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="wrongAnswerScore">Wrong answer score</label>
                                        <TextInput name="wrongAnswerScore" id="wrongAnswerScore"
                                            type="number"
                                            min={0}
                                            value={formData.wrongAnswerScore}
                                            required
                                            errorMessage="Please enter the wrong answer score"
                                            onChange={changeFormData}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="price">Exam cost</label>
                                        <TextInput name="price" id="price"
                                            type="number"
                                            min={0}
                                            value={formData.price}
                                            onChange={changeFormData}
                                        />
                                    </div>
                                    <small>Leave empty if no cost is attached to exam</small>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <label htmlFor="viewAnswersAfterSubmitting">View Answers after submitting</label>
                                    <Radio.Group name="viewAnswersAfterSubmitting" onChange={changeFormData} value={formData.viewAnswersAfterSubmitting}>
                                        <Radio value={true}>Yes</Radio>
                                        <Radio value={false}>No</Radio>
                                    </Radio.Group><br />
                                    <small>Ability to let users view answers selected after an exam</small>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <label htmlFor="openQuiz">Open Quiz</label>
                                    <Radio.Group name="openQuiz" onChange={changeFormData} value={formData.openQuiz}>
                                        <Radio value={true}>Yes</Radio>
                                        <Radio value={false}>No</Radio>
                                    </Radio.Group><br />
                                    <small>Allow unregistered users to take quiz</small>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <label htmlFor="showResultPosition">Show result position</label>
                                    <Radio.Group name="showResultPosition" onChange={changeFormData} value={formData.showResultPosition}>
                                        <Radio value={true}>Yes</Radio>
                                        <Radio value={false}>No</Radio>
                                    </Radio.Group><br />
                                    <small>Ability to show result to user after exam</small>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <label htmlFor="addQuestions">Add Questions</label>
                                    <Radio.Group name="addQuestions" onChange={changeFormData} value={formData.addQuestions}>
                                        <Radio value={true}>Yes</Radio>
                                        <Radio value={false}>No</Radio>
                                    </Radio.Group><br />
                                    <small>Way to add questions: manually, add questions independtly (no) or automatically via level and no of questions (yes)</small>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <label htmlFor="generateCertificate">Generate Certificate</label>
                                    <Radio.Group name="generateCertificate" onChange={changeFormData} value={formData.generateCertificate}>
                                        <Radio value={true}>Yes</Radio>
                                        <Radio value={false}>No</Radio>
                                    </Radio.Group><br />
                                    <small>Ability to generate certificate for exam</small>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <label htmlFor="shuffleQuestions">Shuffle Questions</label>
                                    <Radio.Group name="shuffleQuestions" onChange={changeFormData} value={formData.shuffleQuestions}>
                                        <Radio value={true}>Yes</Radio>
                                        <Radio value={false}>No</Radio>
                                    </Radio.Group><br />
                                    <small>Ability to allow questions to shuffle for users taking exam</small>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <label htmlFor="shuffleOptions">Shuffle Options</label>
                                    <Radio.Group name="shuffleOptions" onChange={changeFormData} value={formData.shuffleOptions}>
                                        <Radio value={true}>Yes</Radio>
                                        <Radio value={false}>No</Radio>
                                    </Radio.Group><br />
                                    <small>Ability to allow options to shuffle for users taking exam</small>
                                </div>
                            </div>
                        </>
                    <div className="form-group float-right">
                        <button disabled={loading.action} className="btn btn-login">{ loading.action ? <><span>Saving</span> <Spin /></> : editMode ? 'Update' : "Save" }</button>
                    </div>
                </ValidationForm><br /><br />
            </Modal>
        </>
    )
}



export default Exams;