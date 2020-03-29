import React, { useEffect, useCallback, useState, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Select, Button, Modal, Alert, Checkbox, Tag, Steps, Popconfirm, Popover, Upload, message, Tooltip, Input, Radio } from 'antd';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import BluetoothSearchingIcon from '@material-ui/icons/BluetoothSearching';
import Edit from '@material-ui/icons/Edit';
import { LoadingOutlined } from '@ant-design/icons';
import { ValidationForm, TextInput, SelectGroup, FileInput } from 'react-bootstrap4-form-validation';
import Pagination from '@material-ui/lab/Pagination';

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

const itemsPerPage = ENV.ITEMSPERPAGE;
const rangeDisplay = ENV.RANGEDISPLAY;

const emptyFormData = {
    content: '',
    explanationText: '',
    explanationResource: '',
    noOfOptions: '4',
    options: [],
    correctAnswers: [],
    questionType: '',
    subject: '',
    level: ''
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

const { Step } = Steps;

const Questions = () => {

    const width = useWindowWidth();

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

    const [formData, setFormData] = useState(emptyFormData);
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
        console.log(formData.correctAnswers);
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
        if(e.target.name == 'explanationResource') {
            let fileContent = e.target.files[0];

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

    const getSingleQuestion = useCallback((val, data) => {
        let question = data.find(question => question.id === val);
        console.log(question);

        setFormData({
            ...formData,
            content: question.content,
            explanationText: question.explanationText,
            explanationResource: question.explanationResource,
            noOfOptions: question.noOfOptions,
            options: question.options,
            correctAnswers: question.correctAnswers,
            questionType: question.questionType,
            subject: question.subject,
            level: question.level
        });
       
    }, [formData, setFormData]);

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
        console.log(formData);

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

        try {
            await dispatch(QuestionsActions.create(form));
            Message('success', 'Question was created successfully', 5);
            setFormData(emptyFormData);
            setImgUrl();
            setCurrentStep(1);
        }catch (error){
            console.log(error.response);
            console.log(error.message);
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

    const getQuestions = useCallback(async (page = 1) => {
        setLoading({
            ...loading,
            content: true
        });

        try {
            await dispatch(QuestionsActions.read(page));
            console.log('first');
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
            setErrors(clearErrors);
        }
        setLoading({
            ...loading,
            content: false
        });
    }, [dispatch, setLoading, loading, setErrors, Notification]);
    
    const getQuestionTypes = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(QuestionTypesActions.read(page, pagination));
            console.log('second');
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);

    const getLevels = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(LevelsActions.read(page, pagination));
            console.log('third');
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);

    const getSubjects = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(SubjectsActions.read(page, pagination));
            console.log('fourth');
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
            return <tr className="text-center"><td colSpan={9}><Spin /></td></tr>
        }
        if(filteredQuestions.length === 0){
            return <tr className="text-center"><td colSpan={9}><strong><i>No record found!</i></strong></td></tr>
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
        console.log(formData);

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
        getQuestions();
        getQuestionTypes();
        getLevels();
        getSubjects();
    }, []);

    // const { noOfOptions, questionType } = formData;
    useEffect(() => {
        getOptions();
    }, [formData.noOfOptions, formData.questionType]);

    useEffect(() => {
        setFilteredQuestions(questions);
    }, [questions]);

    console.log(editModeChecker);
    console.log(formData);
    console.log(options);
    console.log(formData.correctAnswers);

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
                            <div className="text-center"><LoadingOutlined style={{color: 'blue'}} /></div> :
                            <>
                                <div className="col-lg-3 col-md-4">
                                    <Input placeholder="Search question..." allowClear value={filterMe} onChange={changeFilteredMe} />
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
                                                                    ok={deleteQuestion}
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
                                        <TextInput name="content" id="content" multiline 
                                            row={5}
                                            required
                                            errorMessage="Please enter question content"
                                            value={formData.content}
                                            onChange={changeFormData}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="explanationText">Question explanation text</label>
                                        <TextInput name="explanationText" id="explanationText" multiline
                                            row={5}
                                            value={formData.explanationText}
                                            onChange={changeFormData}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="explanationResource">Additional question explanation resource</label>
                                        <FileInput name="explanationResource" id="attachment"
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