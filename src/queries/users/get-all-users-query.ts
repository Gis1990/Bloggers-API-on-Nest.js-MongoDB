import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";
import { ModelForGettingAllUsers } from "../../dtos/users.dto";
import { UserViewModelClassPagination } from "../../entities/users.entity";
import { HelperForUsers } from "../../query-repositories/helpers/helpers.for.users.query.repository";
import { UsersFactory } from "../../factories/users.factory";

export class GetAllUsersCommand {
    constructor(public dto: ModelForGettingAllUsers) {}
}

@QueryHandler(GetAllUsersCommand)
export class GetAllUsersQuery implements IQueryHandler<GetAllUsersCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(query: GetAllUsersCommand): Promise<UserViewModelClassPagination> {
        const dto = await HelperForUsers.createQuery(query.dto);
        const users = await this.usersQueryRepository.getAllUsers(dto);
        return await UsersFactory.createUserViewModelPaginationClass(users);
    }
}
