class AccountType {
    constructor(id, iri, title, description, usersPrivileges, subjectsPrivileges, questionsPrivileges, notificationsPrivileges, levelsPrivileges, accountTypesPrivileges, userGroupsPrivileges, createdBy, createdAtAgo, updatedAtAgo ){
        this.id = id;
        this.iri = iri;
        this.title = title;
        this.description = description;
        this.usersPrivileges = usersPrivileges;
        this.subjectsPrivileges = subjectsPrivileges;
        this.questionsPrivileges = questionsPrivileges;
        this.notificationsPrivileges = notificationsPrivileges;
        this.levelsPrivileges = levelsPrivileges;
        this.accountTypesPrivileges = accountTypesPrivileges;
        this.userGroupsPrivileges = userGroupsPrivileges;
        this.createdBy = createdBy;
        this.createdAtAgo = createdAtAgo;
        this.updatedAtAgo = updatedAtAgo;
    }
}

export default AccountType;