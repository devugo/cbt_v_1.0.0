class UserExamQuestion {
    constructor(id, iri, questionType, exam, content, options, noOfOptions, chosenAnswers, correctAnswers, createdAtAgo, updatedAtAgo, image, explanationResource, explanationText){
        this.id = id;
        this.iri = iri;
        this.questionType = questionType;
        this.exam = exam;
        this.content = content;
        this.options = options;
        this.noOfOptions = noOfOptions;
        this.chosenAnswers = chosenAnswers;
        this.correctAnswers = correctAnswers;
        this.createdAtAgo = createdAtAgo;
        this.updatedAtAgo = updatedAtAgo;
        this.image = image;
        this.explanationResource = explanationResource;
        this.explanationText = explanationText;
    }
}

export default UserExamQuestion;