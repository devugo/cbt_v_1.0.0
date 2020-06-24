class Question {
    constructor(id, iri, content, explanationText, explanationResource, noOfOptions, options, correctAnswers, questionType, subject, level, createdBy, createdAtAgo, updatedAtAgo, exams, image ){
        this.id = id;
        this.iri = iri;
        this.content = content;
        this.explanationText = explanationText;
        this.explanationResource = explanationResource;
        this.noOfOptions = noOfOptions;
        this.options = options;
        this.correctAnswers = correctAnswers;
        this.questionType = questionType;
        this.subject = subject;
        this.level = level;
        this.createdBy = createdBy;
        this.createdAtAgo = createdAtAgo;
        this.updatedAtAgo = updatedAtAgo;
        this.exams = exams;
        this.image = image;
    }
}

export default Question;