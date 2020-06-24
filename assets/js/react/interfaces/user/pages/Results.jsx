import React, { useEffect, useCallback, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Button, Tag, Tooltip, Input } from 'antd';
import BookRoundedIcon from '@material-ui/icons/BookRounded';
import { LoadingOutlined } from '@ant-design/icons';
import Pagination from '@material-ui/lab/Pagination';

import * as ExamsActions from '../../../store/actions/exams';
import * as ExamsTakenActions from '../../../store/actions/exams-taken';
import * as UsersActions from '../../../store/actions/users';
import * as UserExamQuestionsActions from '../../../store/actions/user-exam-questions';
import { Notification } from '../../../UIElements/Notification';
import ResultSheet from '../components/ResultSheet';


import * as ENV from '../../../ENV';

const itemsPerPage = ENV.ITEMSPERPAGE;
const rangeDisplay = ENV.RANGEDISPLAY;

const loaders = {
    content: true,
    action: false
}

const Results = () => {
      
    const exams = useSelector(state => state.exams.data);
    const examsTaken = useSelector(state => state.examsTaken.data);
    const userQuestions = useSelector(state => state.userQuestions.data);
    const user = useSelector(state => state.users.auth);
    const [filteredExamsTaken, setFilteredExamsTaken] = useState(examsTaken);
    const totalExamsTaken = useSelector(state => state.examsTaken.count);

    const dispatch = useDispatch();
    
    // Datatable states
    const [values, setValues] = useState([]);
    const [global, setGlobal] = useState(false);
    const [resultMode, setResultMode] = useState(false)

    const [loading, setLoading] = useState(loaders);
    const [filterMe, setFilterMe] = useState("");
    const [activePage, setActivePage] = useState(1);

    const [examTakenIRI, setExamTakenIRI] = useState();
    const [examConcluded, setExamConcluded] = useState();

    //  Pagination
    const handlePageChange = useCallback((event, pageNumber) => {
        getExamsTaken(pageNumber);
        setActivePage(pageNumber);

    }, [getExamsTaken, setActivePage]);

    //  Datatable
    const changeCheckbox = useCallback((id) => {
        let arr = [];
        if(id === 0){
            if(filteredExamsTaken.length === 0){return;}
            if(values.length !== filteredExamsTaken.length){
                filteredExamsTaken.map(x => arr.push(x.iri));
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
        arr.length === filteredExamsTaken.length ? setGlobal(true) : setGlobal(false);
    }, [filteredExamsTaken, values, setValues, global, setGlobal]);

    const viewResult = useCallback((examTaken, exam) => {
        setExamTakenIRI(examTaken);
        setExamConcluded(exam);

        setResultMode(prevState => !prevState);
    }, [setExamConcluded, setExamTakenIRI, setResultMode]);

    const fetchQuestions = useCallback(async (examTakenIRI) => {
        try {
            await dispatch(UserExamQuestionsActions.read(1, false, examTakenIRI));
            
        }catch(error){
            // if(error.response.data && error.response.data.errors){
            //     let serverErrors = JSON.parse(error.response.data.errors);
            //     if(serverErrors["hydra:title"]){
            //         serverErrorTitle = serverErrors["hydra:title"];
            //         serverErrorDesc = serverErrors["hydra:description"];
            //     }else{
            //         serverErrorDesc = serverErrors
            //     }
            // }
            // setErrors({
            //     title: serverErrorTitle,
            //     description: serverErrorDesc
            // });
       }
    }, [dispatch, loading, setLoading]);

    const getUser = useCallback(async (page = 1, pagination = false) => {

        try {
            await dispatch(UsersActions.auth());
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
    }, [dispatch, Notification]);

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
        }
        setLoading({
            ...loading,
            content: false
        });
    }, [dispatch, setLoading, loading, Notification]);

    const getExamsTaken = useCallback(async (page = 1, pagination = true, exam = null, user = ENV.IRI) => {
        // setFilteredexams(); setexams(); 
        setLoading({
            ...loading,
            content: true
        });

        try {
            await dispatch(ExamsTakenActions.read(page, pagination, exam, user));
        } catch(error) {
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
        }
        setLoading({
            ...loading,
            content: false
        });
    }, [dispatch, setLoading, loading, Notification]);

    const changeFilteredMe = useCallback((e) => {
        setValues([]); setGlobal(false);
        let inputVal = e.target.value;
        setFilterMe(inputVal);
        let newFilterMe = []; // Store filter objects based on inputed fields

        examsTaken.map((exmTakObj) => {
            Object.keys(exmTakObj).map(key => {
                let single = exmTakObj[key];
                let singleUpper = String(single).toUpperCase();
                let inputValUpper = String(inputVal).toUpperCase();

                if(singleUpper.indexOf(inputValUpper) !== -1){
                    newFilterMe.indexOf(exmTakObj) == -1 ? newFilterMe.push(exmTakObj) : null;
                }
            });
        });
        setFilteredExamsTaken(newFilterMe);
    }, [setValues, setGlobal, setFilterMe, examsTaken, setFilteredExamsTaken]);
    
    const renderTableData = () => {
        if (!filteredExamsTaken){
            return <tr className="text-center"><td colSpan={8}><Spin /></td></tr>
        }
        if(filteredExamsTaken.length === 0){
            return <tr className="text-center"><td colSpan={8}><strong><i>No record found!</i></strong></td></tr>
        }
        return filteredExamsTaken.map((exmTak, index) => {
            return (
                <React.Fragment key={index}>
                    <tr className="tr-shadow">
                        <td>
                            {
                                activePage === 1 ? index + 1 : (index + 1 + itemsPerPage) + (itemsPerPage * (activePage - 2))
                            }
                        </td>
                        <td>{exams.length > 0 && exams.find(exam => exam.iri === exmTak.exam).title}</td>
                        <td><Tag color="cyan">{exmTak.createdAtAgo}</Tag></td>
                        <td><Tag color="cyan">{exmTak.submittedAtAgo}</Tag></td>
                        <td><Tag color="cyan">{exmTak.timeSpent} min(s)</Tag></td>
                        <td><Tag color="cyan">{exmTak.timeLeft} min(s)</Tag></td>
                        <td>
                            <Tooltip placement="top" title="View result"><BookRoundedIcon onClick={()=>viewResult(exmTak.iri, exmTak.exam)} style={{cursor: "pointer", color: 'green'}} color="secondary" /></Tooltip>
                        </td>
                    </tr>
                    <tr className="spacer"></tr>
                </React.Fragment>
            )
        })
    }

    useEffect(() => {
        getExamsTaken();
        getExams();
        getUser();
    }, []);

    useEffect(() => {
        setFilteredExamsTaken(examsTaken);
    }, [examsTaken]);

    useEffect(() => {
        if(examTakenIRI){
            fetchQuestions(examTakenIRI);
        }
    }, [examTakenIRI]);

    if(resultMode && user && userQuestions.length > 0){
        return (
            <>
                <ResultSheet 
                    examTakenIRI={examTakenIRI}
                    userQuestions={userQuestions}
                    name={`${user.lastname} ${user.firstname} ${user.othernames}`}
                    email={user.email}
                    exam={exams && exams.find(exam => exam.iri === examConcluded)}
                    noOfAttempts={(user.examsTaken.filter(examTaken => examTaken.exam === examConcluded)).length}
                    setResultMode={setResultMode}
                /><br /><br />
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button onClick={() => setResultMode(false)} style={{width: 100, background: "black", color: "white"}} variant="contained">
                        GO BACK
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="title-5 m-b-35">Exams Taken</h3>
                        {
                            loading.content ?
                            <div className="text-center"><LoadingOutlined style={{color: 'blue', fontSize: 50}} /></div> :
                            <>
                                <div className="row">
                                    <div className="col-lg-3 col-md-4">
                                        <Input placeholder="Search exams taken..." allowClear value={filterMe} onChange={changeFilteredMe} />
                                    </div>
                                </div>
                                <div className="table-responsive table-responsive-data2">
                                    <table className="table table-data2">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name of Exam</th>
                                                <th>Time Taken</th>
                                                <th>Time Submitted</th>
                                                <th>Time Spent</th>
                                                <th>Time Left</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderTableData()}
                                        </tbody>
                                    </table>
                                    {
                                        filteredExamsTaken && filteredExamsTaken.length > 0 &&
                                        <div style={{display: 'flex', justifyContent: 'space-between'}} className="">
                                            <p>Showing {((itemsPerPage * activePage) - itemsPerPage) + 1} to {(examsTaken.length * activePage) + ((itemsPerPage - examsTaken.length) * (activePage - 1))} of {totalExamsTaken} entries</p>
                                             <div>
                                                <Pagination count={Math.ceil(totalExamsTaken/itemsPerPage)} page={activePage} onChange={handlePageChange} color="primary" />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}



export default Results;