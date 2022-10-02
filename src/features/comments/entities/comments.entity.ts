import { ObjectId } from "mongodb";
import { LikesInfoClass, UsersLikesInfoClass } from "../../posts/entities/posts.entity";

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

export class CommentDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: CommentDBClass[],
    ) {}
}

export class NewCommentClassResponseModel {
    constructor(
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public addedAt: string,
        public likesInfo: LikesInfoClass,
    ) {}
}
