import { ObjectId } from "mongodb";

export class BloggerDBClass {
    constructor(public _id: ObjectId, public id: string, public name: string, public youtubeUrl: string) {}
}

export class BloggerClassResponseModel {
    constructor(public id: string, public name: string, public youtubeUrl: string) {}
}

export class BloggerDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: BloggerDBClass[],
    ) {}
}
