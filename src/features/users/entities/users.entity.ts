import { UserAccountDBClass } from "../users.schema";

export class UserDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: UserAccountDBClass[],
    ) {}
}

export class NewUserClassResponseModel {
    constructor(public id: string, public login: string, public email: string, public createdAt: string) {}
}
