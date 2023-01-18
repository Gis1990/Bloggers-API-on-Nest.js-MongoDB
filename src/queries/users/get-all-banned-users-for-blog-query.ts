import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";
import { ModelForGettingAllBannedUsersForBlog } from "../../dtos/users.dto";
import { UserViewModelForBannedUsersByBloggerPaginationClass } from "../../entities/users.entity";
import { GetBlogByIdForBanUnbanOperationCommand } from "../blogs/get-blog-by-id-for-ban-unban-operation-query";
import { HttpException } from "@nestjs/common";
import { HelperForUsers } from "../../query-repositories/helpers/helpers.for.users.query.repository";
import { UsersFactory } from "../../factories/users.factory";

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

    async execute(
        query: GetAllBannedUsersForBlogCommand,
    ): Promise<UserViewModelForBannedUsersByBloggerPaginationClass> {
        const blog = await this.queryBus.execute(new GetBlogByIdForBanUnbanOperationCommand(query.blogId));
        if (blog.blogOwnerInfo.userId !== query.blogOwnerUserId) throw new HttpException("Access denied", 403);
        const dto = await HelperForUsers.createQueryForAllBannedUsersForBlog(query.dto);
        const users = await this.usersQueryRepository.GetAllBannedUsersForBlog(dto, query.blogId);
        return await UsersFactory.createUserViewModelForBannedUsersByBloggerPaginationClass(users, query.blogId);
    }
}
