import { LikesInfoClass, PostInfoClass } from "../schemas/comments.schema";
import { OwnerInfoClass } from "../schemas/blogs.schema";

export class CommentViewModelPaginationClass {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: CommentViewModelClass[],
    ) {}
}

export class CommentViewModelForBloggerPaginationClass {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: CommentViewModelForBloggerClass[],
    ) {}
}

export class CommentViewModelClass {
    constructor(
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public createdAt: Date,
        public likesInfo: LikesInfoClass,
    ) {}
}

export class CommentViewModelForBloggerClass {
    constructor(
        public id: string,
        public content: string,
        public createdAt: Date,
        public likesInfo: LikesInfoClass,
        public commentatorInfo: OwnerInfoClass,
        public postInfo: PostInfoClass,
    ) {}
}
