import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UsersQueryRepository } from "../../users.query.repository";
import { ModelForGettingAllBannedUsersForBlog } from "../../dto/users.dto";
import { UserForBannedUsersByBloggerPaginationClass } from "../../entities/users.entity";

export class GetAllBannedUsersForBlogCommand {
    constructor(public dto: ModelForGettingAllBannedUsersForBlog, public blogId: string) {}
}

@QueryHandler(GetAllBannedUsersForBlogCommand)
export class GetAllBannedUsersForBlogQuery implements IQueryHandler<GetAllBannedUsersForBlogCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(query: GetAllBannedUsersForBlogCommand): Promise<UserForBannedUsersByBloggerPaginationClass> {
        return await this.usersQueryRepository.GetAllBannedUsersForBlog(query.dto, query.blogId);
    }
}
