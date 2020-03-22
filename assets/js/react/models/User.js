class User {
    constructor(id, iri, photo, name, email, username, dob, sex, accountType, createdAtAgo, updatedAtAgo, status, firstname, lastname, othernames ){
        this.id = id;
        this.iri = iri;
        this.photo = photo;
        this.name = name;
        this.email = email;
        this.username = username;
        this.dob = dob;
        this.sex = sex;
        this.accountType = accountType;
        this.createdAtAgo = createdAtAgo;
        this.updatedAtAgo = updatedAtAgo;
        this.status = status;
        this.firstname = firstname;
        this.lastname = lastname;
        this.othernames = othernames;
    }
}

export default User;