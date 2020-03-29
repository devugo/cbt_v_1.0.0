class Exam {
    constructor(id, iri, title, description, startFrom, endAfter, duration, maximumAttempts, percentagePassMark, correctAnswerScore, wrongAnswerScore, allowedIpAddresses, viewAnswersAfterSubmitting, openQuiz, showResultPosition, addQuestions, price, generateCertificate, certificateText, createdAtAgo, updatedAtAgo, status, userGroup, examType, startTime, endTime){
        this.id = id;
        this.iri = iri;
        this.title = title;
        this.description = description;
        this.startFrom = startFrom;
        this.endAfter = endAfter;
        this.duration = duration;
        this.maximumAttempts = maximumAttempts;
        this.percentagePassMark = percentagePassMark;
        this.correctAnswerScore = correctAnswerScore;
        this.wrongAnswerScore = wrongAnswerScore;
        this.allowedIpAddresses = allowedIpAddresses;
        this.viewAnswersAfterSubmitting = viewAnswersAfterSubmitting;
        this.openQuiz = openQuiz;
        this.showResultPosition = showResultPosition;
        this.addQuestions = addQuestions;
        this.price = price;
        this.generateCertificate = generateCertificate;
        this.certificateText = certificateText;
        this.createdAtAgo = createdAtAgo;
        this.updatedAtAgo = updatedAtAgo;
        this.status = status;
        this.userGroup = userGroup;
        this.examType = examType;
        this.startTime = startTime;
        this.endTime = endTime;

    }
}

export default Exam;