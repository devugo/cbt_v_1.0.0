import React, { useEffect, useCallback, useState, useRef} from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Button, Alert, Tag, Badge } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { makeStyles } from '@material-ui/core/styles';

import * as ExamsActions from '../../../store/actions/exams';
import * as UsersActions from '../../../store/actions/users';
import * as ExamTypesActions from '../../../store/actions/exam-types';
import * as UserExamQuestionsActions from '../../../store/actions/user-exam-questions';
import useWindowWidth from '../../../helpers/hooks/useWindowWidth';
import Card from '../../../UIElements/Card';
import { Notification } from '../../../UIElements/Notification';
import { Message } from '../../../UIElements/Message';
import QuestionInterface from '../components/QuestionInterface';
import ResultSheet from '../components/ResultSheet';
import * as ENV from '../../../ENV';
import { encrypt } from '../../../helpers/functions/encrypt';
import { decrypt } from '../../../helpers/functions/decrypt';
import * as LocalStore from '../../../helpers/functions/localStore';

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
    noOfQuestions: '1'
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

const Exams = () => {

    const exams = useSelector(state => state.exams.data);
    const userQuestions = useSelector(state => state.userQuestions.data);
    const user = useSelector(state => state.users.auth);
    const [userExams, setUserExams] = useState();
    const [filteredExams, setFilteredExams] = useState();
    const dispatch = useDispatch();

    const [errors, setErrors] = useState(clearErrors);
    const [loading, setLoading] = useState(loaders);
    const [activePage, setActivePage] = useState(1);
    const [noOfInView, setNoOfInView] = useState(null);
    const [noOfActiveExams, setNoOfActiveExams] = useState(null);
    const [examTakenIRI, setExamTakenIRI] = useState();
    const [examConcluded, setExamConcluded] = useState();
    const [submitting, setSubmitting] = useState(false);
    const [resultMode, setResultMode] = useState(false);

    // Close errors to clear errors
    const onClose = useCallback(() => {
        setErrors(clearErrors);
    }, [setErrors]);

    const submitExam = useCallback(async (timeSpent, timeLeft) => {
        setSubmitting(true);
        try {
            await dispatch(UserExamQuestionsActions.submitExam(examTakenIRI, timeSpent, timeLeft));
            Message('success', 'Exam was submitted successfully', 5);
            setResultMode(true);
            getUser();
            
        }catch(error){
            Message('error', 'There was an error submitting exam', 5);
        }
        setSubmitting(false);
    }, [dispatch, Message, examTakenIRI]);

    const submitAnswer = useCallback(async (id, answer) => {
        try {
            await dispatch(UserExamQuestionsActions.submitAnswer(id, answer));
            
        }catch(error){
            Message('error', 'Answer was not submitted', 5);
       }
    }, [dispatch, Message]);

    const fetchQuestions = useCallback(async (examTakenIRI) => {
        setExamTakenIRI(examTakenIRI);
        try {
            await dispatch(UserExamQuestionsActions.read(1, false, examTakenIRI));

            Message('success', 'Questions were fetched successfully', 5);
            
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
    }, [dispatch, setExamTakenIRI, Message, setErrors, errors, loading, setLoading]);

    const resumeExam = useCallback(() => {
        setLoading({
            ...loading,
            action: true
        });
        let exam = decrypt('greckallowmeexam');
        let examConc = decrypt('greckallowmeexamconc');
        setExamConcluded(examConc);

        fetchQuestions(JSON.parse(exam)); // Remove double quotes from string IRI
        
    }, [setLoading, loading, decrypt, fetchQuestions]);

    const takeExam = useCallback((exam = null) => {
        setExamConcluded(exam);
        LocalStore.remove('greckallowmet');
        LocalStore.remove('greckallowmeexam');
        LocalStore.remove('greckallowmeexamconc');
        setLoading({
            ...loading,
            action: true
        });
        setErrors(clearErrors);
        
        axios({
            method: 'POST',
            url: `${ENV.HOST}/exam-api/take_exam`,
            headers: ENV.HEADERS,
            data: {
                exam: exam
            }
        })
        .then((response) => {
            let examTaken = response.data.examTaken;

            if(examTaken){
                examTaken = JSON.parse(examTaken);
                encrypt('EXAM', JSON.stringify(examTaken["@id"]));
                encrypt('EXAMCONC', JSON.stringify(exam));
                fetchQuestions(examTaken["@id"]);
            }
        })
        .catch(error => {
            if(error.response.data && error.response.data.errors){
                let serverErrors = JSON.parse(error.response.data.errors);
                if(serverErrors){
                    serverErrorDesc = serverErrors
                }
            }
            setErrors({
                title: serverErrorTitle,
                description: serverErrorDesc
            });
            setLoading({
                ...loading,
                action: false
            });
        })
    }, [setLoading, loading, setErrors, errors, ENV, fetchQuestions, setErrors, errors]);

    const activeExams = useCallback(() => {
        if(userExams){
            let result = 0;
            userExams.map(exam => {
                let foundExam = exams.find(exm => exm.iri === exam);
                if(foundExam){
                    let end = foundExam.endAfter ? foundExam.endAfter : null;
                    let start = foundExam.startFrom;
                    let currentDate = new Date().toDateString();


                    if(foundExam.status){
                        let maximumAttempts = foundExam.maximumAttempts;
                        let noOfAttempts = user.examsTaken.filter(exm => exm === exam).length;

                        if(noOfAttempts < maximumAttempts){
                            let newStart = new Date(start).toDateString();
                            if(Math.floor( new Date(currentDate).getTime() / 1000) >= Math.floor( new Date(newStart).getTime() / 1000)){
                                let newEnd = end ? new Date(end).toDateString() : null;
                                if(!newEnd || Math.floor( new Date(currentDate).getTime() / 1000) <= Math.floor( new Date(newEnd).getTime() / 1000)){
                                    let realStartTIme = newEnd ? foundExam.startFrom + ' ' + foundExam.startTime + ':00' : null;
                                    if(newEnd || Math.floor( new Date(realStartTIme).getTime() / 1000) <= Math.floor( new Date().getTime() / 1000)){
                                        let realEndTime = !newEnd ? foundExam.startFrom + ' ' + foundExam.endTime + ':00' : null;
                                        if(!newEnd && Math.floor( new Date(realStartTIme).getTime() / 1000) <= Math.floor( new Date().getTime() / 1000) && Math.floor( new Date(realEndTime).getTime() / 1000) > Math.floor( new Date().getTime() / 1000)){
                                            result++;
                                            return false;
                                        }
                                        
                                        if(newEnd || Math.floor( new Date(realEndTime).getTime() / 1000) > Math.floor( new Date().getTime() / 1000)){
                                            if(foundExam.price == 0){
                                                result++;
                                                return false;
                                            }

                                            //  Get all the paid exams for the current exam loop
                                            let filterPaid = user.paidExams.filter(pd => pd.exam === exam);
                                            // Check if approved
                                            let approved = filterPaid && filterPaid.length > 0 && filterPaid[filterPaid.length - 1] && filterPaid[filterPaid.length - 1].approvedAt && filterPaid[filterPaid.length - 1];

                                            let paid = filterPaid && filterPaid.length > 0 && filterPaid[filterPaid.length - 1];
                                            if(paid && approved){
                                                result++;
                                                return false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            setNoOfActiveExams(result);
        }

        
    }, [user, userExams, exams, setNoOfActiveExams]);

    const inView = useCallback(() => {
        if(userExams){
            let result = 0;
            userExams.map(exam => {
                let foundExam = exams.find(exm => exm.iri === exam);
                if(foundExam){
                    let end = foundExam.endAfter ? foundExam.endAfter : null;
                    let start = foundExam.startFrom;
                    let currentDate = new Date().toDateString();
        
                    if(start){
                        start = new Date(start).toDateString();
                        if(Math.floor(new Date(currentDate).getTime() / 1000) < Math.floor( new Date(start).getTime() / 1000)){
                            result++; 
                            return false;
                        }
                    }
                    if(!end){
                        let realStartTIme = start + ' ' + foundExam.startTime + ':00';
                        if(Math.floor( new Date(realStartTIme).getTime() / 1000) > Math.floor( new Date().getTime() / 1000)){
                            result++; 
                            return false;
                        }
                    }
                }
            })
            setNoOfInView(result);
        }
       

    }, [userExams, exams]);

    const getExams = useCallback(async (page = 1, pagination = true, userGroup = null) => {
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
    }, [dispatch, setLoading, loading, setErrors, Notification]);

    const getExamTypes = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(ExamTypesActions.read(page, pagination));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);

    const getUser = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(UsersActions.auth());
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);
    
    const renderTableData = () => {
        if (!filteredExams){
            return <tr className="text-center"><td colSpan={9}><Spin /></td></tr>
        }
        if(filteredExams.length === 0){
            return <tr className="text-center"><td colSpan={9}><strong><i>No Exam available!</i></strong></td></tr>
        }
        let examsCount = 0;
        return filteredExams.map((exam, index) => {
            let startFrom = exams && exams.length > 0 && exams.find(exm => exm.iri === exam).startFrom;
            let formattedStartFrom = startFrom && new Date(startFrom).toDateString();
            let endAfter = exams && exams.length > 0 && exams.find(exm => exm.iri === exam).endAfter;
            let formattedEndAfter = endAfter && new Date(endAfter).toDateString();
            let price = exams && exams.length > 0 && exams.find(exm => exm.iri === exam).price;

            //  Get all the paid exams for the current exam loop
            let filterPaid = user.paidExams.filter(pd => pd.exam === exam);
            // Check if approved
            let approved = filterPaid && filterPaid.length > 0 && filterPaid[filterPaid.length - 1] && filterPaid[filterPaid.length - 1].approvedAt && filterPaid[filterPaid.length - 1];

            let paid = filterPaid && filterPaid.length > 0 && filterPaid[filterPaid.length - 1];

            let maximumAttempts = exams && exams.length > 0 && exams.find(exm => exm.iri === exam).maximumAttempts;
            let noOfAttempts = user.examsTaken.filter(exmTaken => exmTaken.exam === exam).length;

            let currentDate = new Date().toDateString();

            let realStartTIme = !formattedEndAfter ? exams.find(exm => exm.iri === exam).startFrom + ' ' + exams.find(exm => exm.iri === exam).startTime + ':00' : null;
            let realEndTime = !formattedEndAfter ? exams.find(exm => exm.iri === exam).startFrom + ' ' + exams.find(exm => exm.iri === exam).endTime + ':00' : null;
            

            return (
                <React.Fragment key={index}>
                    <tr className="tr-shadow">
                        <td>
                            {
                                activePage === 1 ? index + 1 : (index + 1 + itemsPerPage) + (itemsPerPage * (activePage - 2))
                            }
                        </td>
                        <td>{exams && exams.length > 0 && exams.find(exm => exm.iri === exam).title}</td>
                        <td className="text-center"><Badge count={maximumAttempts} style={{backgroundColor: 'lemon', fontWeight: 'bold'}} showZero /></td>
                        <td className="text-center"><Badge count={noOfAttempts} style={{backgroundColor: 'green', fontWeight: 'bold'}} showZero /></td>
                        <td className="text-center"><Badge count={exams && exams.length > 0 && exams.find(exm => exm.iri === exam).questions} style={{backgroundColor: 'dodgerBlue', fontWeight: 'bold'}} /></td>
                        <td>{formattedStartFrom} - {formattedEndAfter}</td>
                        <td>{exams && exams.length > 0 && exams.find(exm => exm.iri === exam).startTime} - {exams && exams.length > 0 && exams.find(exm => exm.iri === exam).endTime}</td>
                        <td><Tag color="cyan">{exams && exams.length > 0 && exams.find(exm => exm.iri === exam).createdAtAgo}</Tag></td>
                        <td>
                            <div className="table-data-feature">
                                {
                                    !(exams && exams.length > 0 && exams.find(exm => exm.iri === exam).status) ?
                                    <Tag color="red">Blocked</Tag>:
                                    noOfAttempts >= maximumAttempts  ?
                                    <Tag color="gold">Reached max attempts</Tag> :
                                    Math.floor( new Date(currentDate).getTime() / 1000) < Math.floor( new Date(formattedStartFrom).getTime() / 1000) ?
                                    <Tag color="green">In View</Tag>  :
                                    formattedEndAfter && Math.floor( new Date(currentDate).getTime() / 1000) > Math.floor( new Date(formattedEndAfter).getTime() / 1000) ?
                                    <Tag color="orange">Expired</Tag>  :
                                    !formattedEndAfter && Math.floor( new Date(realStartTIme).getTime() / 1000) > Math.floor( new Date().getTime() / 1000) ?
                                    <Tag color="green">In View</Tag>  :
                                    !formattedEndAfter && Math.floor( new Date(realStartTIme).getTime() / 1000) <= Math.floor( new Date().getTime() / 1000) && Math.floor( new Date(realEndTime).getTime() / 1000) > Math.floor( new Date().getTime() / 1000) ?
                                    <Button disabled={loading.action} type="primary" onClick={() => takeExam(exam)}>
                                        { loading.action ? <><span>Fetching Questions...</span> <Spin /></> : "Take Exam" }
                                    </Button> :
                                    !formattedEndAfter && Math.floor( new Date(realEndTime).getTime() / 1000) <= Math.floor( new Date().getTime() / 1000) ?
                                    <Tag color="orange">Expired</Tag>  :
                                    price == 0 ?
                                    <Button disabled={loading.action} type="primary" onClick={() => takeExam(exam)}>
                                        { loading.action ? <><span>Fetching Questions...</span> <Spin /></> : "Take Exam" }
                                    </Button>
                                    : paid && approved ?
                                    <Button disabled={loading.action} type="primary" onClick={() => takeExam(exam)}>
                                        { loading.action ? <><span>Fetching Questions...</span> <Spin /></> : "Take Exam" }
                                    </Button>
                                    : paid ?
                                    <Tag color="#87d068">Awaiting payment approval</Tag>
                                    :
                                    <Button style={{background: 'green', color: 'white'}}>
                                        {`PAY: ${ENV.CURRENCY} ${price}`}
                                    </Button>
                                }
                            </div>
                        </td>
                    </tr>
                    <tr className="spacer"></tr>
                </React.Fragment>
            )
        })
    }

    useEffect(() => {
        getExamTypes();
        getUser();
        getExams();
    }, []);

    useEffect(() => {
        if(user && user.userGroup && user.userGroup.exams){
            setUserExams(user.userGroup.exams);
            setFilteredExams(user.userGroup.exams);
        }
        // setUserExams(user && user.userGroup.exams);
    }, [user]);

    useEffect(() => {
        if(userExams && userExams.length > 0 && exams){
            inView();
            activeExams();
        }
    }, [userExams, exams]);
    
    if(resultMode && user){
        return (
            <ResultSheet 
                examTakenIRI={examTakenIRI}
                userQuestions={userQuestions}
                name={`${user.lastname} ${user.firstname} ${user.othernames}`}
                email={user.email}
                exam={exams && exams.find(exam => exam.iri === examConcluded)}
                noOfAttempts={(user.examsTaken.filter(examTaken => examTaken.exam === examConcluded)).length}
                setResultMode={setResultMode}
            />
        );
    }

    return (
        <>
            <div className="container-fluid">
                {
                    !userQuestions || userQuestions.length === 0 &&
                    <>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-3 col-md-3">
                                    <Card style={{borderTop: '2px solid dodgerBlue'}}>
                                        <div className="row">
                                            <div className="col-lg-8">
                                                All Exams
                                            </div>
                                            <div className="col-lg-4 col-md-4">
                                                {
                                                    !userExams ?
                                                    <LoadingOutlined style={{color: 'blue'}} />
                                                    : userExams.length
                                                }
                                            </div>
                                        </div>
                                    </Card><br />
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <Card style={{borderTop: '2px solid green'}}>
                                        <div className="row">
                                            <div className="col-lg-8">
                                                Active Exams
                                            </div>
                                            <div className="col-lg-4 col-md-4">
                                            {
                                                noOfActiveExams === null || noOfInView === null  ?
                                                <LoadingOutlined style={{color: 'blue'}} /> :
                                                noOfActiveExams - noOfInView
                                            }
                                            </div>
                                        </div>
                                    </Card><br />
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <Card style={{borderTop: '2px solid blue'}}>
                                        <div className="row">
                                            <div className="col-lg-8">
                                                Upcoming Exams
                                            </div>
                                            <div className="col-lg-4 col-md-4">
                                                {
                                                    noOfInView === 0 ?
                                                    noOfInView :
                                                    !noOfInView ? 
                                                    <LoadingOutlined style={{color: 'blue'}} />
                                                    : noOfInView
                                                }
                                            </div>
                                        </div>
                                    </Card><br />
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <Card style={{borderTop: '2px solid pink'}}>
                                        <div className="row">
                                            <div className="col-lg-8">
                                                Exams Taken
                                            </div>
                                            <div className="col-lg-4 col-md-4">
                                                {
                                                    !user || !user.examsTaken ?
                                                    <LoadingOutlined style={{color: 'blue'}} />
                                                    : user.examsTaken.length 
                                                }
                                            </div>
                                        </div>
                                    </Card><br />
                                </div>
                            </div>
                        </div><br />
                    </>
                }
                {
                    LocalStore.get('greckallowmeexam') && LocalStore.get('greckallowmet')
                    && filteredExams && (!userQuestions || userQuestions.length === 0) &&
                    <>
                        <div className="row text-center">
                            <div className="col-lg-12">
                                <Button disabled={loading.action} type="primary" onClick={resumeExam}>
                                    {
                                        loading.action ? 'Resuming...' : 'Resume Exam'
                                    }
                                </Button>
                            </div>
                        </div><br />
                    </>
                }
                {
                    !userQuestions || userQuestions.length === 0 &&
                    <div className="row">
                        <div className="col-md-12">
                            <h3 className="title-5 m-b-35">Exams</h3>
                            {
                                loading.content ?
                                <div className="text-center"><LoadingOutlined style={{color: 'blue', fontSize: 50}} /></div> :
                                <>
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
                                    <div className="table-responsive table-responsive-data2">
                                        <table className="table table-data2">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>Maximum Attempts</th>
                                                    <th>Attempts Made</th>
                                                    <th>No of Questions</th>
                                                    <th>Date</th>
                                                    <th>Start Time - End Time</th>
                                                    <th>Created</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderTableData()}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                }
                
                {
                    userQuestions.length > 0 &&
                    <QuestionInterface 
                        questions={userQuestions}
                        submitAnswer={submitAnswer}
                        submitExam={submitExam}
                        submitting={submitting}
                        duration={(exams.find(exm => exm.iri === userQuestions[0].exam)).duration * 60}
                    /> 
                }
            </div>
        </>
    )
}



export default Exams;