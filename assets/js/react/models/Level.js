class Level {
    constructor(id, iri, title, description, createdBy, createdAtAgo, updatedAtAgo ){
        this.id = id;
        this.iri = iri;
        this.title = title;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAtAgo = createdAtAgo;
        this.updatedAtAgo = updatedAtAgo;
    }
}

export default Level;