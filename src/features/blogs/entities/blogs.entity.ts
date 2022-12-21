import { ObjectId } from "mongodb";

export class BlogDBClass {
    constructor(
        public _id: ObjectId,
        public id: string,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: Date,
    ) {}
}

export class BlogClassResponseModel {
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

export class ModelForUpdatingBlog {
    constructor(public id: string, public name: string, public description: string, public websiteUrl: string) {}
}
