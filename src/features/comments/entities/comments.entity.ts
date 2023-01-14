import { LikesInfoClass, PostInfoClass } from "../comments.schema";
import { OwnerInfoClass } from "../../blogs/blogs.schema";

export class CommentPaginationClass {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: CommentViewModelClass[],
    ) {}
}

export class CommentForBloggerPaginationClass {
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
