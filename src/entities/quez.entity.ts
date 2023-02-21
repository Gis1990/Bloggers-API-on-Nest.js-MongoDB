export class QuestionViewModelPaginationClass {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: QuestionViewModelClass[],
    ) {}
}

export class QuestionViewModelClass {
    constructor(
        public id: string,
        public body: string,
        public correctAnswers: string[],
        public published: boolean,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
