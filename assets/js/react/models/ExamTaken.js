class ExamTaken {
    constructor(id, iri, user, exam, timeSpent, timeLeft, submittedAtAgo, createdAtAgo, updatedAtAgo ){
        this.id = id;
        this.iri = iri;
        this.user = user;
        this.exam = exam;
        this.timeSpent = timeSpent;
        this.timeLeft = timeLeft;
        this.submittedAtAgo = submittedAtAgo;
        this.createdAtAgo = createdAtAgo;
        this.updatedAtAgo = updatedAtAgo;
    }
}

export default ExamTaken;