import { ObjectId } from "mongodb";

export class CommentDBClass {
    constructor(
        public _id: ObjectId,
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public postId: string,
        public addedAt: string,
        public likesInfo: LikesInfoClass,
        public usersLikesInfo: UsersLikesInfoClass,
    ) {}
}

export class PostDBClass {
    constructor(
        public _id: ObjectId,
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public bloggerId: string,
        public bloggerName: string,
        public addedAt: Date,
        public extendedLikesInfo: ExtendedLikesInfoClass,
        public usersLikesInfo: UsersLikesInfoClass,
    ) {}
}

export type ErrorType = {
    message: string;
    field: string;
};

export class PostDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: PostDBClass[],
    ) {}
}

export class NewPostClassResponseModel {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public bloggerId: string,
        public bloggerName: string,
        public addedAt: Date,
        public extendedLikesInfo: ExtendedLikesInfoClass,
    ) {}
}

export class CommentDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: CommentDBClass[],
    ) {}
}

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

export class ExtendedLikesInfoClass {
    constructor(
        public likesCount: number,
        public dislikesCount: number,
        public myStatus: string,
        public newestLikes: NewestLikesClass[],
    ) {}
}

export class UsersLikesInfoClass {
    constructor(public usersWhoPutLike: string[], public usersWhoPutDislike: string[]) {}
}

export class NewestLikesClass {
    constructor(public addedAt: Date, public userId: string, public login: string) {}
}

export class LikesInfoClass {
    constructor(public likesCount: number, public dislikesCount: number, public myStatus: string) {}
}

export class GameQuestionClass {
    constructor(public id: string, public body: string) {}
}

export class QuizGameDBClass {
    constructor(
        public id: string,
        public firstPlayer: PlayerClass,
        public secondPlayer: PlayerClass,
        public questions: [GameQuestionClass],
        public status: string,
        public pairCreatedDate: Date,
        public startGameDate: Date,
        public finishGameDate: Date,
    ) {}
}

export class PlayerClass {
    constructor(
        public answers: [{ questionId: string; answerStatus: string; addedAt: Date }],
        public user: { id: string; login: string },
        public score: number,
    ) {}
}
