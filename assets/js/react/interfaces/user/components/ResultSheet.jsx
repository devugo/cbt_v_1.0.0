import React, { useState , useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';

import { positionFormatter } from '../../../helpers/functions/positionFormatter';
import { Notification } from '../../../UIElements/Notification';
import * as ExamTakenActions from '../../../store/actions/exams-taken';
import Card from '../../../UIElements/Card';
import { optionTags } from '../helpers/optionTags';
import * as ENV from '../../../ENV';
// import 

const ResultSheet = props => {
    let { userQuestions, name, email, exam, noOfAttempts, examTakenIRI, setResultMode } = props;

    const [currQ, setCurrQ] = useState(0);

    const dispatch = useDispatch();
    const examTaken = useSelector(state => state.examsTaken.single);

    const getExamTaken = useCallback(async (id, answer) => {
        try {
            await dispatch(ExamTakenActions.single(examTakenIRI));
            
        }catch(error){
            Notification("error", "Connection Error", "There was an error connecting. Try back later!", 0)
       }
    }, [dispatch, Notification]);

    let correctScore = 0;
    let wrongScore = 0;
    let unattemptedQuestions = 0;
    let totalScore = 0;

    if(userQuestions){
        userQuestions.map(q => {
            let chosenAnswers = q.chosenAnswers;
            let correctAnswers = q.correctAnswers;
            let options = q.options;
            let questionType = q.questionType;
            if(questionType === '/api/question_types/1'){
                totalScore+=exam.correctAnswerScore;
                if(chosenAnswers && chosenAnswers.length > 0){
                    let indexCorrAns = correctAnswers.findIndex(ans => ans);
                    let correctAnswer = options[indexCorrAns];

                    if(correctAnswer == chosenAnswers[0]){
                        correctScore += exam.correctAnswerScore;
                    }else{
                        wrongScore += exam.wrongAnswerScore;
                    }

                }else {
                    wrongScore += exam.wrongAnswerScore;
                    unattemptedQuestions++;   
                }
            }else if(questionType === '/api/question_types/2'){
                totalScore+=exam.correctAnswerScore;
                if(chosenAnswers.length == 0){
                    unattemptedQuestions++;
                }else{
                    let noOfCorrectAns = correctAnswers.filter(val => val).length;
                    for(let i=0; i<noOfCorrectAns; i++){
                        let index = correctAnswers.findIndex(ans => ans);
    
                        if(chosenAnswers.indexOf(options[index]) != -1){
                            if(i === noOfCorrectAns - 1){
                                correctScore += exam.correctAnswerScore;
                            }
                            continue;
                        }else{
                            wrongScore += exam.wrongAnswerScore;
                        }
                    }
                }
            }else if(questionType == '/api/question_types/3'){
                totalScore+=exam.correctAnswerScore;
                if(chosenAnswers.length == 0){
                    unattemptedQuestions++;
                }else{
                    if(correctAnswers.indexOf(chosenAnswers[0]) != -1){
                        correctScore += exam.correctAnswerScore;
                    }else{
                        wrongScore += exam.wrongAnswerScore;   
                    }
                }
            }else if(questionType == '/api/question_types/6'){
                totalScore+=exam.correctAnswerScore;
                if(chosenAnswers.length == 0){
                    unattemptedQuestions++;
                }else{
                    chosenAnswers.map((ans, index) => {
                        if(correctAnswers.indexOf(ans) != -1){
                            if(index == correctAnswers.length - 1){
                                correctScore += exam.correctAnswerScore;
                            }
                            return true;
                        }else{
                            wrongScore += exam.wrongAnswerScore;
                            return false;
                        }
                    })
                }
            }else{
                totalScore+=exam.correctAnswerScore;
            }
        })
    }

    let percentage = (correctScore/totalScore)*100;

    const changeQuestion = useCallback((no) => {
        setCurrQ(no);
    }, [setCurrQ]);

    let correctAns = [];
    if(userQuestions[currQ].questionType == '/api/question_types/1' || userQuestions[currQ].questionType == '/api/question_types/2')
    userQuestions[currQ].correctAnswers.map((ans, index) => {
        if(ans){
            correctAns.push(userQuestions[currQ].options[index]);
        }
    })

    useEffect(() => {
        getExamTaken();
    }, []);
    return (
        <>
            <div className="result">
                <div className="result-card">
                    <div className="result-card__header">
                        <h2>{name}</h2>
                        <h3>{email}</h3>
                        <h3>{exam.title}</h3>
                        <h4>This is your <span style={{color: 'orange'}}>{positionFormatter(noOfAttempts)}</span> attempt</h4>
                    </div><br /><br />
                    <div className="result-card__grade">
                        <div className="result-card__grade-col">
                            <p>Score</p>
                            <p>{correctScore}</p>
                        </div>
                        <div className="result-card__grade-col">
                            <p>Total score</p>
                            <p>{totalScore}</p>
                        </div>
                        <div className="result-card__grade-col">
                            <p>Unattempted Questions</p>
                            <p>{unattemptedQuestions}</p>
                        </div>
                        <div className="result-card__grade-col">
                            <p>Time Spent</p>
                            <p>{examTaken.timeSpent} Min(s)</p>
                        </div>
                        <div className="result-card__grade-col">
                            <p>Time Left</p>
                            <p>{examTaken.timeLeft} Min(s)</p>
                        </div>
                        <div className="result-card__grade-col">
                            <p>Time Taken</p>
                            <p>{examTaken.createdAtAgo}</p>
                        </div>
                        <div className="result-card__grade-col">
                            <p>Percentage</p>
                            <p>{Math.round(percentage)}%</p>
                        </div>
                        <div className="result-card__grade-col">
                            <p>Pass Score</p>
                            <p>{exam.percentagePassMark}%</p>
                        </div>
                        <div className="result-card__grade-col">
                            <p>Remark</p>
                            <p>{percentage < exam.percentagePassMark ? 'Fail' : 'Pass'}</p>
                        </div>
                    </div><br /><br />
                    <div>
                        <Button type="primary" onClick={()=>window.print()}>
                            PRINT
                        </Button>
                    </div><br />
                </div>
            </div>
            <div className="answer-sheet">
                <Card>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div>
                            <h4>Questions Review</h4>
                        </div><br />
                        <div style={{width: 50, height: 50, borderRadius: '50%', color: 'white', backgroundColor: 'orange', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <span style={{fontSize: 20}}><strong>{currQ+1}</strong></span>
                        </div>
                    </div>
                    <div>
                        {
                            userQuestions[currQ].image &&
                            <>
                                <div>
                                    <img src={`${ENV.HOST}/uploads/question_images/${userQuestions[currQ].image}`} style={{width: 300, height: 300}} alt="question" />
                                </div><br />
                            </>
                        }
                        <div dangerouslySetInnerHTML={{ __html: userQuestions[currQ].content }} />
                    </div><hr />
                    {
                        userQuestions[currQ].questionType == '/api/question_types/1' || userQuestions[currQ].questionType == '/api/question_types/2' || userQuestions[currQ].questionType == '/api/question_types/6' ?
                        <div>
                            {
                                userQuestions[currQ].options.map((opt, index) => <p>{`(${optionTags[index]}) ${opt}`}</p>)
                            }
                        </div> : null
                    }
                   
                    <div>
                        <p><strong>Correct Answers: </strong>{userQuestions[currQ].questionType == '/api/question_types/1' || userQuestions[currQ].questionType == '/api/question_types/2' ? correctAns.toString() : userQuestions[currQ].correctAnswers.toString()}</p>
                        <p><strong>Chosen Answers: </strong>{userQuestions[currQ].questionType == '/api/question_types/3' || userQuestions[currQ].questionType == '/api/question_types/4' ? userQuestions[currQ].chosenAnswers[0] : userQuestions[currQ].chosenAnswers.toString()}</p>
                    </div>
                    {
                        userQuestions[currQ].explanationText &&
                        <div dangerouslySetInnerHTML={{ __html: userQuestions[currQ].explanationText }} />
                    }
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        {
                            currQ >= 1 &&
                            <Button onClick={() => changeQuestion(currQ - 1)}  variant="contained" style={{width: 100}}>
                                Previous
                            </Button>
                        }
                        {
                            userQuestions.length-1 !== currQ &&
                            <Button onClick={() => changeQuestion(currQ + 1)} style={{float: "right", width: 100, background: "#017f81"}} variant="contained" color="primary">
                                Next
                            </Button>
                                
                        }
                    </div>
                </Card>
            </div>
        </>
    );
}

export default ResultSheet;