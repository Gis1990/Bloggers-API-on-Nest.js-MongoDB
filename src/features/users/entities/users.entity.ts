import { BanInfoClass, UserAccountClass } from "../users.schema";

export class UserDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: UserAccountClass[],
    ) {}
}

export class UserViewModelClass {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public createdAt: Date,
        public banInfo: BanInfoClass,
    ) {}
}
