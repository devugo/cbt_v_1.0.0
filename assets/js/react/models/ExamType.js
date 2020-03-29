class ExamType {
    constructor(id, iri, title, description, createdAtAgo, updatedAtAgo ){
        this.id = id;
        this.iri = iri;
        this.title = title;
        this.description = description;
        this.createdAtAgo = createdAtAgo;
        this.updatedAtAgo = updatedAtAgo;
    }
}

export default ExamType;