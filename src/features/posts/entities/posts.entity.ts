import { ObjectId } from "mongodb";

export class PostDBClass {
    constructor(
        public _id: ObjectId,
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public addedAt: Date,
        public extendedLikesInfo: ExtendedLikesInfoClass,
        public usersLikesInfo: UsersLikesInfoClass,
    ) {}
}

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
        public blogId: string,
        public blogName: string,
        public addedAt: Date,
        public extendedLikesInfo: ExtendedLikesInfoClass,
    ) {}
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
