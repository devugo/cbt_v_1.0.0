import React, { useEffect, useState, useCallback } from 'react';
import 'crypto-js/sha256';
import axios from 'axios';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Spin, Select, Modal, Alert, Checkbox, Tag, Steps, Popconfirm, Popover, Upload, message, Tooltip, Input } from 'antd';

import { encrypt } from '../../../helpers/functions/encrypt';
import * as LocalStore from '../../../helpers/functions/localStore';
import { Notification } from '../../../UIElements/Notification';
import QuestionNoTab from './QuestionNoTab';
import { optionTags } from '../helpers/optionTags';
import * as ENV from '../../../ENV';
import { Message } from '../../../UIElements/Message';
import { numberFromString } from '../../../helpers/functions/numberFromString';
import { decrypt } from '../../../helpers/functions/decrypt';

const { TextArea } = Input;
var CryptoJS = require("crypto-js");

function QuestionInterface (props)  {
    const [value, setValue] = React.useState('');
    const [time, setTime] = React.useState();
    const [timeUnused, setTimeUnused] = useState(props.duration);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answersSelected, setAnswersSelected] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    const [currentLongShortAnswer, setCurrentLongShortAnswer] = useState('');
    const [examSubmitted, setExamSubmitted] = useState(false);
    
    let questions = props.questions;
    let timeLeft = decrypt('greckallowmet') && LocalStore.get('greckallowmeexam') ? decrypt('greckallowmet') : props.duration;
    let interval;

    const stopTimer = useCallback(() => {
        clearInterval(interval);
    });

    const getTimer = useCallback(() => {
        timeLeft--;
        let $duration = timeLeft;

        setTimeUnused($duration);

        let $hr,
            $mins,
            $sec,
            $sec_rem, $countdown;

        (3600 < $duration) ? $hr = Math.floor($duration / 3600) : $hr = '0';

        $sec_rem = $duration % 3600;
        $mins = Math.floor($sec_rem / 60);
        $sec = $sec_rem % 60;

        ($sec > 9) ? $sec = $sec : $sec = '0' + $sec;
        ($mins > 9) ? $mins = $mins : $mins = '0' + $mins;
        ($hr > 9) ? $hr = $hr : $hr = '0' + $hr;
    
        $countdown = $hr + ':' + $mins + ':' + $sec;  
        //Remove later, not needed
        // if(timeLeft < 590){
        //     stopTimer();
        // }
        //Remove later, not needed

        encrypt('TIME', JSON.stringify($duration));
        if(timeLeft <= 0){
            stopTimer();
            
        }
        setTime($countdown);
     
    }, [timeLeft, setTime, encrypt, examSubmitted, setTimeUnused]);

    useEffect(() => {
        if(time <= '00:00:00' && !examSubmitted){
            submitExam();
            alert("Sorry, Exam time limit has been reached and exam has been submitted");
        }
    })

    // Drag and drop methods
    function containerHasDraggedElement(targ){
        if(targ.id[1] === 'r'){
            return true;
        }
        if(targ.children.length > 0){
            return true;
        }
        return false;
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }
    
    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
    
    function drop(ev) {
        ev.preventDefault();
        let targ = ev.target;
        if(containerHasDraggedElement(targ)){
           return;
        }
       
        var data = ev.dataTransfer.getData("text");
        let answerSel = document.getElementById(data).getAttribute("answer"); 
        let optionKey = numberFromString(targ.id);
        let answers = [...answersSelected];
        if(optionKey >= questions[currentQuestion].options.length){
            let filteredAnswers = answers.filter(ans => ans !== answerSel);
            setAnswersSelected(filteredAnswers);
        }else{
            answers[optionKey] = answerSel;
            setAnswersSelected(answers);
        }
   
        ev.target.appendChild(document.getElementById(data));
    }
    
    // Drag and drop methods
    
    const submitExam = useCallback(() => {
        stopTimer();
        setExamSubmitted(true);
        LocalStore.remove('greckallowmet');
        LocalStore.remove('greckallowmeexam');
        props.submitAnswer(questions[currentQuestion].id, answersSelected);

        props.submitExam(Math.floor(timeUnused/60), (Math.floor(timeLeft/60) - Math.floor(timeUnused/60)));
        // setOpenDialog(false);

    }, [props, timeLeft, examSubmitted, setExamSubmitted, timeUnused, questions, currentQuestion, answersSelected]);

    const handleChange = useCallback((event) => {
        let answerPicked = event.target.value;
        if(time <= '00:00:00'){
            Notification("error", "Exam Error", "Sorry, Exam is over!", 0)
            setTimeout(() => { 
                window.location.href = `${ENV.HOST}/user/`;
            }, 1000);
        }
        setValue(answerPicked);

        let ansSelected = [...answersSelected];
        if(questions[currentQuestion].questionType === '/api/question_types/1'){
            ansSelected = [answerPicked];

            setAnswersSelected(ansSelected);
        }else if(questions[currentQuestion].questionType === '/api/question_types/2'){
            ansSelected.push(answerPicked);
            let uniqueAnsSelected = new Set(ansSelected);

            setAnswersSelected([...uniqueAnsSelected]);
        }
    }, [time, Notification, ENV, setValue, answersSelected, questions, currentQuestion, setAnswersSelected]);

    const changeLongShortAnswer = (e) => {
        let value = e.target.value;
        setCurrentLongShortAnswer(value);
        setAnswersSelected([value]);
    }

    const changeSelectCorrect = (val) => {
        let answerPicked = val;
        if(time <= '00:00:00'){
            Notification("error", "Exam Error", "Sorry, Exam is over!", 0);
            setTimeout(() => { 
                window.location.href = `${ENV.HOST}/user/`;
            }, 3000);
        }
        let ansSelected = [...answersSelected];
        if(questions[currentQuestion].questionType === '/api/question_types/2'){
            ansSelected.push(answerPicked);
            let uniqueAnsSelected = new Set(ansSelected);

            setAnswersSelected([...uniqueAnsSelected]);
        }
    }

    const changeQuestion = useCallback((value) => {
        // Set current selected value to empty string to avoid carrying over a selected an answer from a previous question to another
        setValue("");
        setAnswersSelected([]);
        setCurrentLongShortAnswer("");
        if(questions[value].questionType == '/api/question_types/1'){
            if(questions[value].chosenAnswers.length > 0){
                
                setValue(questions[value].chosenAnswers[0])
            }
        }else if(questions[value].questionType == '/api/question_types/3' || questions[value].questionType == '/api/question_types/4') {
            if(questions[value].chosenAnswers.length > 0){
                
                setCurrentLongShortAnswer(questions[value].chosenAnswers[0]);
            }
        }
        // Submit answet if at least an answer has been chosen
        if(answersSelected.length > 0){
            if(questions[currentQuestion].questionType === '/api/question_types/1'){
                props.submitAnswer(questions[currentQuestion].id, answersSelected);
            }else if(questions[currentQuestion].questionType === '/api/question_types/2'){
                props.submitAnswer(questions[currentQuestion].id, [...answersSelected]);
            }else if(questions[currentQuestion].questionType === '/api/question_types/3' || questions[currentQuestion].questionType === '/api/question_types/4' || questions[currentQuestion].questionType === '/api/question_types/6'){
                props.submitAnswer(questions[currentQuestion].id, answersSelected);
            }
        }
        
        // Check to control setting of current question index to prevent manual inputing of values by an attacker
        if(value < questions.length && value >= 0){
            setCurrentQuestion(value);
        }
    }, [props, setValue, questions, answersSelected, setCurrentQuestion]);

    const moveToAQuestion = useCallback((no) => {
        setValue("");
        setAnswersSelected([]);
        setCurrentLongShortAnswer("");

        if(questions[no].questionType == '/api/question_types/1'){
            if(questions[no].chosenAnswers.length > 0){
                
                setValue(questions[no].chosenAnswers[0])
            }
        }else if(questions[no].questionType == '/api/question_types/3' || questions[no].questionType == '/api/question_types/4') {
            if(questions[no].chosenAnswers.length > 0){
                
                setCurrentLongShortAnswer(questions[no].chosenAnswers[0]);
            }
        }
        // Submit answet if at least an answer has been chosen
        if(answersSelected.length > 0){
            if(questions[currentQuestion].questionType === '/api/question_types/1'){
                props.submitAnswer(questions[currentQuestion].id, answersSelected);
            }else if(questions[currentQuestion].questionType === '/api/question_types/2'){
                props.submitAnswer(questions[currentQuestion].id, [...answersSelected]);
            }else if(questions[currentQuestion].questionType === '/api/question_types/3' || questions[currentQuestion].questionType === '/api/question_types/4' || questions[currentQuestion].questionType === '/api/question_types/6'){
                props.submitAnswer(questions[currentQuestion].id, answersSelected);
            }
        }

        setCurrentQuestion(no);
    }, [setValue, setCurrentQuestion, setAnswersSelected, setCurrentLongShortAnswer, questions, value, answersSelected, currentQuestion, props]);

    useEffect(() => {
    //    getAnswers();
        if(questions[currentQuestion].questionType == '/api/question_types/1'){
            if(questions[currentQuestion].chosenAnswers.length > 0){
                
                setValue(questions[currentQuestion].chosenAnswers[0]);
            }   
        }
        
        interval = setInterval(getTimer, 1000);
    }, []);

    // let labelOne = 'one';
    return (
        <div className="body-content">
            {/* <div className="subjects-header text-center" id="subjects-header">
                <SubjectsTab />
            </div> */}
            <div className="questions-tab" id="questions-tab">
                <div className="card" id="questions-card">
                    <div className="card-header">
                        <strong>Question {currentQuestion + 1} of {questions.length}</strong> Subject Name{/* questions[currentQuestion].examQuestion.topic.subject.name */}(Topic Name{/* questions[currentQuestion].examQuestion.topic.name */})<span style={{float: "right", color: time < '00:05:00' ? 'red' : ''}}><strong>{time}</strong></span>
                    </div>
                    <div className="card-body">
                        <div>
                            {
                                questions[currentQuestion].image &&
                                <>
                                    <div>
                                        <img src={`${ENV.HOST}/uploads/question_images/${questions[currentQuestion].image}`} style={{width: 300, height: 300}} alt="question" />
                                    </div><br />
                                </>
                            }
                            <div dangerouslySetInnerHTML={{ __html: questions[currentQuestion].content }} />
                        </div><hr />
                        <div>
                            <div className="row">
                                <div className="col-lg-12">
                                    {
                                        questions[currentQuestion].questionType === '/api/question_types/1' &&
                                        <RadioGroup aria-label="option" name="option" value={value} onChange={handleChange}>
                                            {
                                                questions[currentQuestion].options.map((option, index) => <FormControlLabel key={index} value={option} control={<Radio color="primary" />} label={`${optionTags[index]}) ${option}`} />)
                                            }
                                        </RadioGroup>
                                    }
                                    {/* {
                                        questions[currentQuestion].questionType === '/api/question_types/2' &&
                                        answersSelected.length > 0 &&
                                            questions[currentQuestion].options.map((option, index) => {
                                                //  Merge answersSelected with chosenAnswers to an array and filter uniquely
                                                let mergeAnswers = [...new Set(answersSelected.concat(questions[currentQuestion].chosenAnswers))];
                                                // console.log(mergeAnswers);
                                                return (
                                                    <div className="row" style={{marginBottom: 20, marginLeft: 10}}
                                                    key={index}>
                                                        <Checkbox
                                                            onChange={() => changeSelectCorrect(option)}
                                                            checked={mergeAnswers.indexOf(option) != -1}
                                                        >
                                                            {`${optionTags[index]}) ${option}`}
                                                        </Checkbox>
                                                    </div>
                                                )
                                            })
                                    } */}
                                    {/* {
                                        questions[currentQuestion].questionType === '/api/question_types/2' &&
                                        answersSelected.length == 0 &&
                                            questions[currentQuestion].options.map((option, index) => {
                                                return (
                                                    <div className="row" style={{marginBottom: 20, marginLeft: 10}}
                                                    key={index}>
                                                        <Checkbox
                                                            onChange={() => changeSelectCorrect(option)}
                                                            checked={questions[currentQuestion].chosenAnswers.length > 0 && questions[currentQuestion].chosenAnswers.includes(option)}
                                                        >
                                                            {`${optionTags[index]}) ${option}`}
                                                        </Checkbox>
                                                    </div>
                                                )
                                            })
                                    } */}
                                    {
                                        questions[currentQuestion].questionType === '/api/question_types/2' &&
                                            questions[currentQuestion].options.map((option, index) => {
                                                return (
                                                    <div className="row" style={{marginBottom: 20, marginLeft: 10}}
                                                    key={index}>
                                                        <Checkbox
                                                            onChange={() => changeSelectCorrect(option)}
                                                            checked={answersSelected.indexOf(option) != -1}
                                                        >
                                                            {`${optionTags[index]}) ${option}`}
                                                        </Checkbox>
                                                    </div>
                                                )
                                            })
                                    }
                                    {
                                        questions[currentQuestion].questionType === '/api/question_types/3' || questions[currentQuestion].questionType === '/api/question_types/4' ?
                                        <TextArea allowClear value={currentLongShortAnswer} onChange={changeLongShortAnswer} /> : null
                                    }
                                    {
                                        questions[currentQuestion].questionType === '/api/question_types/6' &&
                                        <>
                                            <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                                                <div style={{display: 'flex', flexDirection: 'column', width: '30%'}}>
                                                    {
                                                        questions[currentQuestion].options.map((option, index) => {
                                                            return (
                                                                <div key={index} style={{width: '100%', height: 70, padding: 10, border: '1px solid #aaaaaa'}}>
                                                                    <p style={{width: 300, height: 60, display: 'block'}}>{option}</p>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', width: '10%'}}>
                                                    {
                                                        questions[currentQuestion].options.map((option, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <span style={{fontSize: 30}}>=</span>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div style={{display: 'flex', flexDirection: 'column', width: '30%'}}>
                                                    {
                                                        questions[currentQuestion].options.map((option, index) => {
                                                            return (
                                                                <div style={{display: 'flex'}} key={index}>
                                                                    <span style={{width: '10%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', }}>{questions[currentQuestion].chosenAnswers[index]}</span> 
                                                                    <div id={`container${index}`} style={{width: '100%', height: 70, padding: 10, border: '1px solid #aaaaaa', borderStyle: 'dotted'}} onDrop={drop} onDragOver={allowDrop}>
                                                                        
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div style={{display: 'flex', flexDirection: 'column', width: '30%'}}>
                                                    {
                                                        questions[currentQuestion].correctAnswers.map((ans, index) => {
                                                            return (
                                                                <div key={index} id={`container${questions[currentQuestion].correctAnswers.length + index}`} style={{width: '100%', height: 70, padding: 10, border: '1px solid #aaaaaa'}} onDrop={drop} onDragOver={allowDrop}>
                                                                    <p answer={ans} id={`drag${questions[currentQuestion].correctAnswers.length + index}`} draggable="true" onDragStart={drag} style={{width: 300, height: 60, display: 'block'}}>{ans}</p>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <br />
                                        </>
                                        
                                    }
                                    {/* <div className="row" key={index}>
                                                <div className="col-lg-12 col-md-12">
                                                    <Checkbox
                                                        onChange={() => changeSelectCorrect(x)}
                                                        checked={formData.correctAnswers[x-1]}
                                                    >Select Correct Option</Checkbox> */}
                                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                        {
                                            currentQuestion >= 1 &&
                                            <Button onClick={() => changeQuestion(currentQuestion - 1)}  variant="contained" style={{width: 100}}>
                                                Previous
                                            </Button>
                                        }
                                        {
                                            questions.length-1 !== currentQuestion &&
                                            <Button onClick={() => changeQuestion(currentQuestion + 1)} style={{float: "right", width: 100, background: "#017f81"}} variant="contained" color="primary">
                                                Next
                                            </Button>
                                               
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div style={{background: 'grey', padding: "15px 10px 10px 10px", width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <p style={{color: "white"}}>Navigation and Answers Selected</p>
                            <Button onClick={() => setOpenDialog(true)} style={{float: "right", width: 100, background: "green", color: "white"}} variant="contained" color="primary">
                                Submit
                            </Button>
                        </div>
                        {
                            //  get all submitted answers
                            questions.map((question, index) => {

                                let questionOptionTags = [];
                                if(question.questionType === '/api/question_types/3'){
                                    if(question.chosenAnswers.length > 0){
                                        questionOptionTags.push(question.chosenAnswers[0]);
                                    }
                                }else if(question.questionType === '/api/question_types/4' || question.questionType === '/api/question_types/5' || question.questionType === '/api/question_types/6'){
                                    if(question.chosenAnswers.length > 0){
                                        questionOptionTags.push(0);
                                    } 
                                }else{
                                    question.chosenAnswers.map(ans => {
                                        question.options.map((option, index) => {
                                            if(ans === option){
                                                questionOptionTags.push(optionTags[index]);
                                            }
                                        })
                                    });
                                }

                                return(
                                    <QuestionNoTab 
                                        key={index} 
                                        no={index + 1} 
                                        backgroundColor={currentQuestion === index ? "orange" : questionOptionTags.length > 0 ? 'yellow' : "#222" }
                                        color={currentQuestion === index ? "white" : questionOptionTags.length > 0 ? '#222' : "white" }
                                        option={question.questionType === '/api/question_types/4' || question.questionType === '/api/question_types/5' || question.questionType === '/api/question_types/6' ? '' : questionOptionTags.toString()}
                                        onClick={moveToAQuestion.bind(this, index)}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth={true} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"><div className="text-center">This action can't be reversed. Are you sure you want to submit exam?</div></DialogTitle>
                <DialogContent>
                    <div>
                        <div>
                            { props.submitting ? 
                                <div className="text-center">
                                    <CircularProgress style={{color: "#017f81", width: 20, height: 20}} /> 
                                </div> :
                                <div>
                                    <Button style={{float: "left", background: "#017f81", color: "white"}} onClick={submitExam} color="primary">
                                        Submit
                                    </Button>
                                    <Button style={{float: "right"}} onClick={() => setOpenDialog(false)} color="primary">
                                        Cancel
                                    </Button>
                                </div>
                            }
                        </div>
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
        
    );
}

export default QuestionInterface;