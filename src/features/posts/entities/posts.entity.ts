import { ExtendedLikesInfoClass, PostDBClass } from "../postsSchema";

export class PostDBPaginationClass {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: PostDBClass[],
    ) {
        this.items = items;
    }

    async getLikesDataForPostsWithPagination(userId: string | undefined): Promise<PostViewModelClass[]> {
        if (userId) {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].extendedLikesInfo.newestLikes = this.items[i].extendedLikesInfo.newestLikes
                    .slice(-3)
                    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
                this.items[i].extendedLikesInfo.myStatus = this.items[i].returnUsersLikeStatus(
                    this.items[i].id,
                    userId,
                );
            }
        } else {
            this.items.forEach(
                (elem) =>
                    (elem.extendedLikesInfo.newestLikes = elem.extendedLikesInfo.newestLikes
                        .slice(-3)
                        .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())),
            );
            this.items.forEach((elem) => (elem.extendedLikesInfo.myStatus = "None"));
        }
        return this.items;
    }
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
