import { BlogDBClass } from "../blogs.schema";

export class BlogResponseModelClass {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: Date,
    ) {}
}

export class BlogDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: BlogDBClass[],
    ) {}
}
