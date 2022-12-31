import { CommentDBClass, LikesInfoClass } from "../comments.schema";

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
        public createdAt: Date,
        public likesInfo: LikesInfoClass,
    ) {}
}
