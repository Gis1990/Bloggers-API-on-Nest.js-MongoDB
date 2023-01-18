import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";

export class GetAllBannedBlogsCommand {
    constructor(public bannedUsersIdsBySuperAdmin: string[]) {}
}

@QueryHandler(GetAllBannedBlogsCommand)
export class GetAllBannedBlogsQuery implements IQueryHandler<GetAllBannedBlogsCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetAllBannedBlogsCommand): Promise<string[]> {
        let bannedBlogsIds = [];
        const bannedBlogsInDB = await this.blogsQueryRepository.getAllBannedBlogs(query.bannedUsersIdsBySuperAdmin);
        if (bannedBlogsInDB) {
            bannedBlogsIds = bannedBlogsInDB.map((elem) => elem.id);
        }
        return bannedBlogsIds;
    }
}
