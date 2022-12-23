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
        public emailRecoveryCode: UserRecoveryCodeClass,
        public loginAttempts: LoginAttemptsClass[],
        public emailConfirmation: UserAccountEmailClass,
        public userDevicesData: userDevicesDataClass[],
        public currentSession: Record<string, string>,
    ) {}
}

export class UserRecoveryCodeClass {
    constructor(public recoveryCode: string, public expirationDate: Date) {}
}

export class userDevicesDataClass {
    constructor(
        public ip: string,
        public lastActiveDate: Date,
        public deviceId: string,
        public title: string | undefined,
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
    constructor(public id: string, public login: string, public email: string, public createdAt: string) {}
}

export class LoginAttemptsClass {
    constructor(public attemptDate: Date, public ip: string) {}
}

export class SentEmailsClass {
    constructor(public sentDate: string) {}
}
