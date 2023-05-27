import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";

export class GetAllSubscribedBlogsCommand {
    constructor(public readonly userId: string) {}
}

@QueryHandler(GetAllSubscribedBlogsCommand)
export class GetAllSubscribedBlogsQuery implements IQueryHandler<GetAllSubscribedBlogsCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetAllSubscribedBlogsCommand): Promise<string[]> {
        let subscribedBlogsIds = [];
        const subscribedBlogsInDB = await this.blogsQueryRepository.getSubscribedBlogs(query.userId);
        if (subscribedBlogsInDB) {
            subscribedBlogsIds = subscribedBlogsInDB.map((elem) => elem.id);
        }
        return subscribedBlogsIds;
    }
}
