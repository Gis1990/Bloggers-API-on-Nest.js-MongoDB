import { ObjectId } from "mongodb";

export class UserDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: UserAccountDBClass[],
    ) {}
}

export class UserAccountDBClass {
    constructor(
        public _id: ObjectId,
        public id: string,
        public login: string,
        public email: string,
        public passwordHash: string,
        public createdAt: string,
        public loginAttempts: LoginAttemptsClass[],
        public emailConfirmation: UserAccountEmailClass,
        public blacklistedRefreshTokens: RefreshTokenClass[],
    ) {}
}

export class UserAccountEmailClass {
    constructor(
        public sentEmails: SentEmailsClass[],
        public confirmationCode: string,
        public expirationDate: Date,
        public isConfirmed: boolean,
    ) {}
}

export class NewUserClassResponseModel {
    constructor(public id: string, public login: string) {}
}

export class LoginAttemptsClass {
    constructor(public attemptDate: Date, public ip: string) {}
}

export class RefreshTokenClass {
    constructor(public token: string) {}
}

export class SentEmailsClass {
    constructor(public sentDate: string) {}
}
