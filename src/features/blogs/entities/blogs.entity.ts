import { ObjectId } from "mongodb";

export class BlogDBClass {
    constructor(public _id: ObjectId, public id: string, public name: string, public youtubeUrl: string) {}
}

export class BlogClassResponseModel {
    constructor(public id: string, public name: string, public youtubeUrl: string) {}
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
