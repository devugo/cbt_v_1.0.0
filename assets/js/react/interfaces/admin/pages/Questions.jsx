import React, { useEffect, useCallback, useState, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Select, Button, Modal, Alert, Checkbox, Tag, Steps, Popconfirm, Popover, Upload, message, Tooltip, Input, Radio } from 'antd';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import Edit from '@material-ui/icons/Edit';
import { LoadingOutlined } from '@ant-design/icons';
import { ValidationForm, TextInput, SelectGroup, FileInput } from 'react-bootstrap4-form-validation';
import Pagination from '@material-ui/lab/Pagination';
import SelectMat from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InputMat from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MathJax from 'react-mathjax2'

const ascii = 'U = 1/(R_(si) + sum_(i=1)^n(s_n/lambda_n) + R_(se))'

import * as ExamsActions from '../../../store/actions/exams';
import * as QuestionsActions from '../../../store/actions/questions';
import * as QuestionTypesActions from '../../../store/actions/question-types';
import * as SubjectsActions from '../../../store/actions/subjects';
import * as LevelsActions from '../../../store/actions/levels';
import Breadcrumb from '../components/Breadcrumb';
import useWindowWidth from '../../../helpers/hooks/useWindowWidth';
import UploadButton from '../../../UIElements/UploadButton';
import Paginate from '../../../UIElements/Paginate';
import { Notification } from '../../../UIElements/Notification';
import { Message } from '../../../UIElements/Message';
import QuickConfirm from '../../../UIElements/QuickConfirm';

import * as ENV from '../../../ENV';

const { Option } = Select;

const itemsPerPage = ENV.ITEMSPERPAGE;
const rangeDisplay = ENV.RANGEDISPLAY;

const emptyFormData = {
    content: '',
    explanationText: '',
    explanationResource: '',
    image: '',
    noOfOptions: '4',
    options: [],
    correctAnswers: [],
    questionType: '',
    subject: '',
    level: ''
};

const emptySortData = {
    questionType: '',
    level: '',
    subject: ''
};

const clearErrors = {
    title: '',
    description: '',
    selectExam: ''
};

const loaders = {
    content: true,
    action: false
}

let serverErrorTitle = ENV.ERRORTITLE;
let serverErrorDesc = ENV.ERRORDESC;

const { Step } = Steps;

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    chipList: {
      margin: theme.spacing(0.5),
    },
}));

const Questions = () => {

    const width = useWindowWidth();  const classes = useStyles();
    const theme = useTheme();
    const [sentTo, setSentTo] = React.useState([]);

    const handleChange = useCallback((event) => {
        // console.log(sentTo);
        setSentTo(event.target.value);
        setErrors({
            ...errors,
            selectExam: ''
        });
    }, [setSentTo, setErrors, errors]);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
          },
        },
    };

    function getStyles(name, sentTo, theme) {
        return {
          fontWeight:
            sentTo.indexOf(name) === -1
              ? theme.typography.fontWeightRegular
              : theme.typography.fontWeightMedium,
        };
    }

    const exams = useSelector(state => state.exams.data);
    const questions = useSelector(state => state.questions.data);
    const subjects = useSelector(state => state.subjects.data);
    const levels = useSelector(state => state.levels.data);
    const questionTypes = useSelector(state => state.questionTypes.data);
    const [filteredQuestions, setFilteredQuestions] = useState(questions);
    const totalQuestions = useSelector(state => state.questions.count);
    const dispatch = useDispatch();
    
    // Datatable states
    const [values, setValues] = useState([]);
    const [global, setGlobal] = useState(false);

    const [errors, setErrors] = useState(clearErrors);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddQuestionModal, setOpenAddQuestionModal] = useState(false);

    const [formData, setFormData] = useState(emptyFormData);
    const [sortData, setSortData] = useState(emptySortData);
    const [loading, setLoading] = useState(loaders);
    const [imgUrl, setImgUrl] = useState();
    const [filterMe, setFilterMe] = useState("");
    const [activePage, setActivePage] = useState(1);

    const [editMode, setEditMode] = useState(false);
    const [idToEdit, setIdToEdit] = useState();

    const [currentStep, setCurrentStep] = useState(1);
    const [options, setOptions] = useState();
    const [editModeChecker, setEditModeChecker] = useState(0); // Introduce not to reset options and correct answers fetched for question to be updated

    const [idToDelete, setIdToDelete] = useState();

    //  Pagination
    const handlePageChange = useCallback((event, pageNumber) => {
        getQuestions(pageNumber);
        setActivePage(pageNumber);
    }, [getQuestions, setActivePage]);

    //  Datatable
    const changeCheckbox = useCallback((id) => {
        let arr = [];
        if(id === 0){
            if(filteredQuestions.length === 0){return;}
            if(values.length !== filteredQuestions.length){
                filteredQuestions.map(x => arr.push(x.iri));
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
        arr.length === filteredQuestions.length ? setGlobal(true) : setGlobal(false);
    }, [filteredQuestions, values, setValues, global, setGlobal]);

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

    const changeSelectCorrect = useCallback((x) => {
        let correctAnswers = [...formData.correctAnswers];
        if(formData.questionType === '/api/question_types/1'){
            correctAnswers.map((x, index) => correctAnswers[index] = false);
        }

        correctAnswers[x-1] = !correctAnswers[x-1];

        setFormData({
            ...formData,
            correctAnswers: correctAnswers
        });
    }, [formData, setFormData]);

    const onChangeSortQuestionType = useCallback((value) => {
        setSortData({
            ...sortData,
            questionType: value
        });
    }, [sortData, setSortData]);

    const onChangeSortLevel = useCallback((value) => {
        setSortData({
            ...sortData,
            level: value
        });
    }, [sortData, setSortData]);

    const onChangeSortSubject = useCallback((value) => {
        setSortData({
            ...sortData,
            subject: value
        });
    }, [sortData, setSortData]);

    const changeQuestionContent = useCallback((value) => {
        setFormData({
            ...formData,
            content: value
        })
    }, [setFormData, formData]);

    const changeQuestionExplanationText = useCallback((value) => {
        setFormData({
            ...formData,
            explanationText: value
        })
    }, [setFormData, formData]);

    const changeFormData = useCallback((e) => {
        let name = e.target.name;

        if(name.indexOf("correctAnswer") === 0 && formData.questionType === '/api/question_types/6'){
            let matches = name.match(/(\d+)/);

            let newAns = [...formData.correctAnswers];
            newAns[matches[0] -1] = e.target.value;
            return setFormData({
                ...formData,
                correctAnswers: newAns
            });
        }

        // if long answer question
        if(formData.questionType === '/api/question_types/4' && name === 'correctAnswers'){
            let correctAns = [...formData.correctAnswers];
            correctAns[0] = e.target.value;

            return setFormData({
                ...formData,
                correctAnswers: correctAns
            });
        }

        // For Short answer question
        if(name === 'correctAnswers'){
            return setFormData({
                ...formData,
                correctAnswers: e.target.value.split(",")
            });
        }

        if(name.indexOf("option") === 0){
            let matches = name.match(/(\d+)/);

            let newOpt = [...formData.options];
            newOpt[matches[0] -1] = e.target.value;
            return setFormData({
                ...formData,
                options: newOpt
            })
        }
        if(name == 'explanationResource' || name == 'image') {
            let fileContent = e.target.files[0];

            setFormData({
                ...formData,
                [name]: fileContent
            });
        }else{
            setFormData({
                ...formData,
                [name]: e.target.value
            });
        }
        
    }, [formData, setFormData]);

    const changeEditContent = useCallback((val, data) => {
        setEditMode(true);
        // setEditModeChecker(1);
        getSingleQuestion(val, data);
        setIdToEdit(val);
        setOpenAddModal(true);
    }, [setEditMode, getSingleQuestion, setIdToDelete, setOpenDeleteModal]);

    const changeContent = useCallback((val) => {
        setValues([val]);
        setIdToDelete(val);
        setOpenDeleteModal(true);
    }, [setIdToDelete, setValues, setOpenDeleteModal]);

    
    const handleDelete = (exam, question) => () => {

        removeExamFromQuestion(exam, question);
        getQuestions();
       
    };

    const removeExamFromQuestion = useCallback(async (exam, question) => {
        try {
            await dispatch(QuestionsActions.removeFromExam({exam: exam, question: question}));
            Message('success', 'Question was removed from exam successfully', 5);
        }catch (error){
            Message('error', 'There was an error removing question from exam', 5);
        }
    }, [dispatch]);

    const getSingleQuestion = useCallback((val, data) => {
        let question = data.find(question => question.id === val);

        setFormData({
            ...formData,
            content: question.content,
            explanationText: question.explanationText,
            explanationResource: question.explanationResource,
            image: question.image,
            noOfOptions: question.noOfOptions,
            options: question.options,
            correctAnswers: question.correctAnswers,
            questionType: question.questionType,
            subject: question.subject,
            level: question.level
        });
       
    }, [formData, setFormData]);

    const addQuestionsToExam = useCallback(async (e) => {
        e.preventDefault();

        if(sentTo.length < 1){
            // return;
            return setErrors({
                ...errors,
                selectExam: 'Please, select atleast one exam'
            });
        }
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);
        
        try {
            await dispatch(QuestionsActions.addToExams({questions: values, exams: sentTo.map(exam => exam.iri)}));
            Message('success', 'Questions were added to exams successfully', 5);
            setSentTo([]);
            setValues([]);
            setGlobal(false);
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
    }, [sentTo, setErrors, errors, setLoading, loading, values, ]);

    const deleteQuestion = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });

        try {
            await dispatch(QuestionsActions.destroy(values));

            setOpenDeleteModal(false);
            values.length > 1 ? Message('success', 'Questions were deleted successfully', 5) : Message('success', 'Question was deleted successfully', 5);
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

    const updateQuestion = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);

        const form = new FormData();
        form.append('content', formData.content);
        form.append('explanationText', formData.explanationText);
        form.append('noOfOptions', formData.noOfOptions);
        form.append('options', JSON.stringify(formData.options));
        form.append('correctAnswers', JSON.stringify(formData.correctAnswers));
        form.append('questionType', formData.questionType);
        form.append('subject', formData.subject);
        form.append('level', formData.level);
        form.append('explanationResource', formData.explanationResource);
        form.append('image', formData.image);

        try {
            await dispatch(QuestionsActions.update(idToEdit, form));
            Message('success', 'Question was updated successfully', 5);
            setOpenAddModal(false);
            setFormData(emptyFormData);
            setImgUrl();
            setEditMode(false);
            setCurrentStep(1);
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

    const createQuestion = useCallback(async (e) => {
        e.preventDefault();
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);

        const form = new FormData();
        form.append('content', formData.content);
        form.append('explanationText', formData.explanationText);
        form.append('noOfOptions', formData.noOfOptions);
        form.append('options', JSON.stringify(formData.options));
        form.append('correctAnswers', JSON.stringify(formData.correctAnswers));
        form.append('questionType', formData.questionType);
        form.append('subject', formData.subject);
        form.append('level', formData.level);
        form.append('explanationResource', formData.explanationResource);
        form.append('image', formData.image);

        try {
            await dispatch(QuestionsActions.create(form));
            Message('success', 'Question was created successfully', 5);
            setFormData(emptyFormData);
            setImgUrl();
            setCurrentStep(1);
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

    const getQuestions = useCallback(async (page = 1, pagination = true, questionType = sortData.questionType, subject = sortData.subject, level = sortData.level) => {
        setLoading({
            ...loading,
            content: true
        });

        try {
            await dispatch(QuestionsActions.read(page, pagination, questionType, subject, level));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
            setErrors(clearErrors);
        }
        setLoading({
            ...loading,
            content: false
        });
    }, [dispatch, setLoading, loading, setErrors, Notification, sortData]);
    
    const getQuestionTypes = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(QuestionTypesActions.read(page, pagination));
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

    const getExams = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(ExamsActions.read(page, pagination, null, null));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);

    const changeFilteredMe = useCallback((e) => {
        setValues([]); setGlobal(false);
        let inputVal = e.target.value;
        setFilterMe(inputVal);
        let newFilterMe = []; // Store filter objects based on inputed fields

        questions.map((questionObj) => {
            Object.keys(questionObj).map(key => {
                let single = questionObj[key];
                let singleUpper = String(single).toUpperCase();
                let inputValUpper = String(inputVal).toUpperCase();

                if(singleUpper.indexOf(inputValUpper) !== -1){
                    newFilterMe.indexOf(questionObj) == -1 ? newFilterMe.push(questionObj) : null;
                }
            });
        });
        setFilteredQuestions(newFilterMe);
    }, [setValues, setGlobal, setFilterMe, questions, setFilteredQuestions]);
    
    const renderTableData = () => {
        if (!filteredQuestions){
            return <tr className="text-center"><td colSpan={10}><Spin /></td></tr>
        }
        if(filteredQuestions.length === 0){
            return <tr className="text-center"><td colSpan={10}><strong><i>No record found!</i></strong></td></tr>
        }
        return filteredQuestions.map((question, index) => {
            let checker = isChecked(question.iri);
            return (
                <React.Fragment key={index}>
                    <tr className="tr-shadow">
                        <td>
                            <Checkbox
                                onChange={() => changeCheckbox(question.iri)}
                                checked={checker}
                            />
                        </td>
                        <td>
                            {
                                activePage === 1 ? index + 1 : (index + 1 + itemsPerPage) + (itemsPerPage * (activePage - 2))
                            }
                        </td>
                        <td>{questionTypes && questionTypes.length > 0 && (questionTypes.find(type => type.iri === question.questionType)).title}</td>
                        <td>{subjects && subjects.length > 0 && (subjects.find(sub => sub.iri === question.subject)).title}</td>
                        <td>{levels && levels.length > 0 && (levels.find(lev => lev.iri === question.level)).title}</td>
                        <td>{question.content}</td>
                        <td>
                            { 
                                exams && exams.length > 0 &&
                                question.exams.map((exam, index) => (
                                    <Chip
                                        key={index}
                                        label={exams.find(exm => exm.iri === exam).title}
                                        onDelete={handleDelete(exam, question.iri)}
                                        className={classes.chipList}
                                        size="small"
                                        color="primary"
                                    />
                                    )
                                )
                            }
                        </td>
                        <td className="text-center">{question.explanationResource ? <span style={{display: 'flex', justifyContent: 'space-around'}}><i style={{color: 'green'}} className="fa fa-check-circle"></i><Tooltip placement="top" title="View attachment"><a target="_blank" href={`/ViewerJS/#../uploads/explanation_resources/${question.explanationResource}`} ><i style={{color: 'orange', cursor: 'pointer'}} className="fa fa-eye"></i></a></Tooltip></span> : <i style={{color: 'red'}} className="fa fa-times"></i>}</td>
                        <td><Tag color="cyan">{question.createdAtAgo}</Tag></td>
                        <td>
                            <Tooltip placement="top" title="Edit question"><Edit onClick={() => changeEditContent(question.id, questions)} style={{cursor: "pointer"}} color="primary" /></Tooltip>
                            <Tooltip placement="top" title="Delete question"><DeleteForeverSharpIcon onClick={()=>changeContent(question.iri)} style={{cursor: "pointer"}} color="secondary" /></Tooltip>
                            
                        </td>
                    </tr>
                    <tr className="spacer"></tr>
                </React.Fragment>
            )
        })
    }

    const getOptions = useCallback(() => {
        let options = [];
        let optionsArr = [];
        let correctAnswersArr = [];

        // check to be sure atleast two options for question was selected
        if(formData.noOfOptions > 1){
            for(let i = 1; i <= formData.noOfOptions; i++){
                // optionsArr[i-1] = 3*i;
                optionsArr[i-1] = '';
                options.push(i);
                // Question type selected is match
                if(formData.questionType === '/api/question_types/6') {
                    correctAnswersArr.push('');
                }else{
                    correctAnswersArr.push(false);
                }
                
            }
            if(editModeChecker > 0 || !editMode){ // Introduce editModeChecker not to reset options and correct answers fetched for question to be updated
                setFormData({
                    ...formData,
                    options: optionsArr,
                    correctAnswers: correctAnswersArr
                });
            }

            if(editMode){
                setEditModeChecker(editModeChecker+1);
            }
        }
        setOptions(options);
    }, [formData, setFormData, options, setOptions]);

    useEffect(() => {
        getQuestionTypes();
        getLevels();
        getSubjects();
        getExams();
    }, []);

    useEffect(() => {
        getQuestions();
    }, [sortData]);

    // const { noOfOptions, questionType } = formData;
    useEffect(() => {
        getOptions();
    }, [formData.noOfOptions, formData.questionType]);

    useEffect(() => {
        setFilteredQuestions(questions);
    }, [questions]);

    return (
        <>
            <Breadcrumb 
                pageTitle="questions"
                addResource={() => setOpenAddModal(true)}
            />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="title-5 m-b-35">Questions</h3>
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
                                                    placeholder="Filter by question type"
                                                    optionFilterProp="children"
                                                    onChange={onChangeSortQuestionType}
                                                    value={sortData.questionType}
                                                >
                                                    <Option value="">All Question types</Option>
                                                    {
                                                        questionTypes && questionTypes.length > 0 && questionTypes.map((qType, index) => <Option key={index} value={qType.iri}>{qType.title}</Option>)
                                                    }
                                                </Select>
                                            </div>
                                            <div style={{width: '33%'}}>
                                                <Select
                                                    showSearch
                                                    style={{width: 200}}
                                                    placeholder="Filter by subject"
                                                    optionFilterProp="children"
                                                    onChange={onChangeSortSubject}
                                                    value={sortData.subject}
                                                >
                                                    <Option value="">All Subjects</Option>
                                                    {
                                                        subjects && subjects.length > 0 && subjects.map((subject, index) => <Option key={index} value={subject.iri}>{subject.title}</Option>)
                                                    }
                                                </Select>
                                            </div>
                                            <div style={{width: '33%'}}>
                                                <Select
                                                    showSearch
                                                    style={{width: 200}}
                                                    placeholder="Filter by level"
                                                    optionFilterProp="children"
                                                    onChange={onChangeSortLevel}
                                                    value={sortData.level}
                                                >
                                                    <Option value="">All Levels</Option>
                                                    {
                                                        levels && levels.length > 0 && levels.map((level, index) => <Option key={index} value={level.iri}>{level.title}</Option>)
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div><br />
                                <div className="row">
                                    <div className="col-lg-3 col-md-4">
                                        <Input placeholder="Search question..." allowClear value={filterMe} onChange={changeFilteredMe} />
                                    </div>
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
                                                            <Tooltip placement="top" title="Delete multiple questions">
                                                                <QuickConfirm
                                                                    title="Delete All?"
                                                                    color="red"
                                                                    tagName="Delete"
                                                                    ok={deleteQuestion}
                                                                />
                                                            </Tooltip>
                                                        } 
                                                    </th>
                                                    <th>
                                                        {
                                                        loading.action ? 
                                                            <LoadingOutlined style={{color: 'blue'}} /> :
                                                            <Tooltip placement="top" title="Add questions to exam">
                                                                <QuickConfirm
                                                                    title="Add questions to exam?"
                                                                    color="green"
                                                                    tagName="Add"
                                                                    ok={() => setOpenAddQuestionModal(true)}
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
                                                        indeterminate={filteredQuestions && values.length > 0 && values.length !== filteredQuestions.length}
                                                    />
                                                </th>
                                                <th>#</th>
                                                <th>Question Type</th>
                                                <th>Subject</th>
                                                <th>Level</th>
                                                <th>Content</th>
                                                <th>Exams in</th>
                                                <th>Explanation Resource</th>
                                                <th>Created</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderTableData()}
                                        </tbody>
                                    </table>
                                    {
                                        filteredQuestions && filteredQuestions.length > 0 &&
                                        <div style={{display: 'flex', justifyContent: 'space-between'}} className="">
                                            <p>Showing {((itemsPerPage * activePage) - itemsPerPage) + 1} to {(questions.length * activePage) + ((itemsPerPage - questions.length) * (activePage - 1))} of {totalQuestions} entries</p>
                                            {/* <Paginate
                                                activePage={activePage}
                                                itemsPerPage={itemsPerPage}
                                                totalItems={totalquestions}
                                                rangeDisplay={rangeDisplay}
                                                handlePageChange={handlePageChange}
                                            /> */}
                                             <div>
                                                <Pagination count={Math.ceil(totalQuestions/itemsPerPage)} page={activePage} onChange={handlePageChange} color="primary" />
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
                            <Button onClick={deleteQuestion} type="primary">Delete</Button>
                            <Button onClick={() => {setOpenDeleteModal(false)}}>Cancel</Button>
                        </>
                    }
                    
                </div>
            </Modal>

            <Modal
                title="Add questions to exams"
                centered
                visible={openAddQuestionModal}
                onCancel={() => {setOpenAddQuestionModal(false); setValues([])}}
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
                <ValidationForm onSubmit={addQuestionsToExam}>
                    <div className="row">
                        <div className="col-lg-12">
                            <small><span style={{color: 'blue'}}><strong>NB:</strong></span> Questions can only be added to exams that are set to add questions manually</small><br />
                            <InputLabel id="demo-mutiple-chip-label">Select Exams</InputLabel>
                            {
                                exams.length > 0 ? 
                                <SelectMat
                                    style={{width: '100%'}}
                                    labelId="demo-mutiple-chip-label"
                                    id="demo-mutiple-chip"
                                    multiple
                                    value={sentTo}
                                    onChange={handleChange}
                                    input={<InputMat id="select-multiple-chip" />}
                                    renderValue={selected => (
                                        <div className={classes.chips}>
                                        {selected.map(value => (
                                            <Chip key={value.title} label={value.title} className={classes.chip} />
                                        ))}
                                        </div>
                                    )}
                                    MenuProps={MenuProps}
                                    >
                                    {exams.filter(exm => !exm.addQuestions).map(exam => (
                                        <MenuItem key={exam.id} value={exam} style={getStyles(exam, sentTo, theme)}>
                                        {exam.title}
                                        </MenuItem>
                                    ))}
                                </SelectMat>
                                :
                                <div> No exam available for this option</div>
                            }
                            {sentTo.length < 1 && <small style={{color: 'red'}}>{errors.selectExam}</small>}
                        </div>
                    </div>
                    <div className="form-group float-right">
                        <button disabled={loading.action} className="btn btn-login">{ loading.action ? <><span>Sending</span> <Spin /></> : "Add" }</button>
                    </div>
                </ValidationForm><br /><br />
            </Modal>
            
            <Modal
                title={ editMode ? 'Update question' : 'Add question' }
                centered
                visible={openAddModal}
                onCancel={() => {setOpenAddModal(false); setCurrentStep(1); setEditModeChecker(0), setEditMode(false); setFormData(emptyFormData), setErrors(clearErrors), setIdToEdit()}}
                footer={null}
                zIndex={1000}
                width={width > 1024 ? '70%' : width > 768 ? '80%' : width > 360 ? '90%' : '100%'}
            >
                
                <Steps size="small" current={currentStep}>
                    <Step title="Select Question Type" />
                    <Step title="Input Question" />
                </Steps><br />
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
                <ValidationForm onSubmit={editMode ? updateQuestion : createQuestion}>

                    {
                        currentStep === 1 &&
                        <>
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="questionType">Question Type</label>
                                        <SelectGroup name="questionType" id="questionType"
                                            value={formData.questionType}
                                            required
                                            errorMessage="Please a select a question type"
                                            onChange={changeFormData}
                                        >
                                            <option value="">--- Please select ---</option>
                                            {
                                                questionTypes.map((questionType, index) => <option key={index} value={questionType.iri}>{questionType.title}</option>)
                                            }
                                        </SelectGroup>
                                    </div>
                                </div>
                                {
                                    formData.questionType !== '/api/question_types/3' && formData.questionType !== '/api/question_types/4' &&
                                    <div className="col-lg-6 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="noOfOptions">No of Options</label>
                                            <TextInput name="noOfOptions" id="noOfOptions"
                                                type="number"
                                                min={2}
                                                required
                                                errorMessage="Please select the number of options"
                                                value={formData.noOfOptions}
                                                onChange={changeFormData}
                                            />
                                        </div>
                                    </div>
                                }
                               
                            </div>
                            {
                                formData.questionType && formData.noOfOptions &&
                                <div className="float-right">
                                    <Button onClick={() => setCurrentStep(2)}>Next</Button>
                                </div>
                            }
                        </>
                    }
                    {
                        currentStep === 2 &&
                        <>
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
                                <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="content">Question Content</label>
                                        <ReactQuill value={formData.content}
                                            onChange={changeQuestionContent} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="image">Question image if any</label>
                                        <FileInput name="image" id="image"
                                            onChange={changeFormData}
                                            fileType={["jpg", "jpeg", "png", "gif"]}
                                            maxFileSize="500 kb"
                                            errorMessage={
                                                {
                                                    fileType: "Only jpg, jpeg, png and gif file type asre allowed",
                                                    maxFileSize: "Max file size is 500 kb"
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="explanationText">Question explanation text</label>
                                        <ReactQuill value={formData.explanationText}
                                            onChange={changeQuestionExplanationText} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="explanationResource">Additional question explanation resource</label>
                                        <FileInput name="explanationResource" id="explanationResource"
                                            onChange={changeFormData}
                                            fileType={["pdf", "doc", "docx", "xls", "xlsx"]}
                                            maxFileSize="500 kb"
                                            errorMessage={
                                                {
                                                    fileType: "Only pdf, doc, and excel files is allowed",
                                                    maxFileSize: "Max file size is 500 kb"
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            {
                                formData.questionType === '/api/question_types/1' || formData.questionType === '/api/question_types/2' ?
                                    options.map((x, index) => {
                                        return (
                                            <div className="row" key={index}>
                                                <div className="col-lg-12 col-md-12">
                                                    <Checkbox
                                                        onChange={() => changeSelectCorrect(x)}
                                                        checked={formData.correctAnswers[x-1]}
                                                    >Select Correct Option</Checkbox>
                                                    <div className="form-group">
                                                        <label htmlFor={`option${x}`}>Option {x}</label>
                                                        <TextInput name={`option${x}`} id={`option${x}`} multiline
                                                            row={5}
                                                            value={`${formData.options[x-1]}`}
                                                            onChange={changeFormData}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                : null
                            }
                            {
                                formData.questionType === '/api/question_types/3' &&
                                <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="correctAnswers">Possible Answers</label>
                                            <TextInput name="correctAnswers" id="correctAnswers" multiline
                                                row={5}
                                                value={formData.correctAnswers.toString()}
                                                onChange={changeFormData}
                                            />
                                        </div>
                                        <small>Add possible answers to question, each answer separated with a comma ',' e.g sand,soil</small>
                                    </div>
                                </div>
                            }
                            {
                                formData.questionType === '/api/question_types/4' &&
                                <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="correctAnswers">Long answer</label>
                                            <TextInput name="correctAnswers" id="correctAnswers" multiline
                                                row={5}
                                                value={formData.correctAnswers[0]}
                                                onChange={changeFormData}
                                            />
                                        </div>
                                        <small>Add possible answers to question, each answer separated with a comma ',' e.g sand,soil</small>
                                    </div>
                                </div>
                            }
                            {
                                formData.questionType === '/api/question_types/6' ?
                                options.map((x, index) => {
                                    return (
                                        <div className="row" key={index}>
                                            <div className="col-lg-5 col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor={`option${x}`}>Option {x}</label>
                                                    <TextInput name={`option${x}`} id={`option${x}`} multiline
                                                        row={5}
                                                        value={`${formData.options[x-1]}`}
                                                        onChange={changeFormData}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-2"><br /><br />
                                                <div className="text-center">
                                                    =
                                                </div>
                                            </div>
                                            <div className="col-lg-5 col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor={`correctAnswer${x}`}>Answer {x}</label>
                                                    <TextInput name={`correctAnswer${x}`} id={`correctAnswer${x}`} multiline
                                                        row={5}
                                                        value={`${formData.correctAnswers[x-1]}`}
                                                        onChange={changeFormData}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                             : null
                            }
                            <Button onClick={() => setCurrentStep(1)}>Previous</Button>
                            <div className="form-group float-right">
                                <button disabled={loading.action} className="btn btn-login">{ loading.action ? <><span>Saving</span> <Spin /></> : editMode ? 'Update' : "Save" }</button>
                            </div>
                        </>
                    }
                   
                </ValidationForm><br /><br />
            </Modal>
        </>
    )
}



export default Questions;