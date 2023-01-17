import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";
import { ModelForGettingAllBannedUsersForBlog } from "../../dtos/users.dto";
import { UserForBannedUsersByBloggerPaginationClass } from "../../entities/users.entity";
import { GetBlogByIdForBanUnbanOperationCommand } from "../blogs/get-blog-by-id-for-ban-unban-operation-query";
import { HttpException } from "@nestjs/common";

export class GetAllBannedUsersForBlogCommand {
    constructor(
        public readonly dto: ModelForGettingAllBannedUsersForBlog,
        public readonly blogId: string,
        public readonly blogOwnerUserId: string,
    ) {}
}

@QueryHandler(GetAllBannedUsersForBlogCommand)
export class GetAllBannedUsersForBlogQuery implements IQueryHandler<GetAllBannedUsersForBlogCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository, private queryBus: QueryBus) {}

    async execute(query: GetAllBannedUsersForBlogCommand): Promise<UserForBannedUsersByBloggerPaginationClass> {
        const blog = await this.queryBus.execute(new GetBlogByIdForBanUnbanOperationCommand(query.blogId));
        if (blog.blogOwnerInfo.userId !== query.blogOwnerUserId) throw new HttpException("Access denied", 403);
        return await this.usersQueryRepository.GetAllBannedUsersForBlog(query.dto, query.blogId);
    }
}
