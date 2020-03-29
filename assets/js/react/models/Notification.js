class Notification {
    constructor(id, iri, sentBy, sentTo, title, message, actionLink, seenAtAgo, createdAtAgo, updatedAtAgo ){
        this.id = id;
        this.iri = iri;
        this.sentBy = sentBy;
        this.sentTo = sentTo;
        this.title = title;
        this.message = message;
        this.actionLink = actionLink;
        this.seenAtAgo = seenAtAgo;
        this.createdAtAgo = createdAtAgo;
        this.updatedAtAgo = updatedAtAgo;
    }
}

export default Notification;