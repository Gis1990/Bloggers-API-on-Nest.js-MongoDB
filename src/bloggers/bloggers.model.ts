import { ObjectId } from "mongodb";

export class BloggerDBClass {
    constructor(public _id: ObjectId, public id: string, public name: string, public youtubeUrl: string) {}
}

export class BloggerClassResponseModel {
    constructor(public id: string, public name: string, public youtubeUrl: string) {}
}

export class BloggerDBClassPagination {
    constructor(
        readonly pagesCount: number,
        readonly page: number,
        readonly pageSize: number,
        readonly totalCount: number,
        readonly items: BloggerDBClass[],
    ) {}
}
