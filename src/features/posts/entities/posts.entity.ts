import { ExtendedLikesInfoClass } from "../postsSchema";

export class PostDBPaginationClass {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: PostViewModelClass[],
    ) {}
}

export class PostViewModelClass {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: Date,
        public extendedLikesInfo: ExtendedLikesInfoClass,
    ) {}
}
