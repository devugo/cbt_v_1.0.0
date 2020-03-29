class Subject {
    constructor(id, iri, title, description, cost, daysValidity, status, createdBy, createdAtAgo, updatedAtAgo, noOfExams ){
        this.id = id;
        this.iri = iri;
        this.title = title;
        this.description = description;
        this.cost = cost;
        this.daysValidity = daysValidity;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAtAgo = createdAtAgo;
        this.updatedAtAgo = updatedAtAgo;
        this.noOfExams = noOfExams;
    }
}

export default Subject;