import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UsersQueryRepository } from "../../users.query.repository";
import { ModelForGettingAllBannedUsersForBlog } from "../../dto/users.dto";
import { UserPaginationClass } from "../../entities/users.entity";

export class GetAllBannedUsersForBlogCommand {
    constructor(public dto: ModelForGettingAllBannedUsersForBlog) {}
}

@QueryHandler(GetAllBannedUsersForBlogCommand)
export class GetAllBannedUsersForBlogQuery implements IQueryHandler<GetAllBannedUsersForBlogCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(query: GetAllBannedUsersForBlogCommand): Promise<UserPaginationClass> {
        return await this.usersQueryRepository.GetAllBannedUsersForBlog(query.dto);
    }
}
